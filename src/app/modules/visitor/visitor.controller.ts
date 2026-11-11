/* eslint-disable @typescript-eslint/no-unused-vars */
import { Visitor } from "./visitor.model.js";
import { VisitorSession } from "./visitorSession.model.js";
import { PageView } from "./pageView.model.js";
import type { Request, Response } from "express";

// Track a page view
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const trackPageView = async (req:Request, res:Response) => {
  try {
    const { visitorId, sessionId, path, referrer } = req.body;

    if (
      typeof visitorId !== "string" ||
      visitorId.length > 100 ||
      typeof sessionId !== "string" ||
      sessionId.length > 100 ||
      typeof path !== "string" ||
      path.length > 500 ||
      !path.startsWith("/")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid tracking data",
      });
    }

    const now = new Date();

    await Visitor.findOneAndUpdate(
      { visitorId },
      {
        $set: { lastSeenAt: now },
        $setOnInsert: { firstSeenAt: now },
        $inc: { totalPageViews: 1 },
      },
      { upsert: true, new: true },
    );

    await VisitorSession.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          visitorId,
          currentPath: path,
          lastSeenAt: now,
        },
      },
      { upsert: true },
    );

    await PageView.create({
      visitorId,
      sessionId,
      path,
      referrer:
        typeof referrer === "string"
          ? referrer.slice(0, 500)
          : "",
    });

    return res.status(200).json({
      success: true,
      message: "Visitor tracked successfully",
    });
  } catch (error) {
    console.error("Visitor tracking error:", error);

    return res.status(500).json({
      success: false,
      message: "Visitor tracking failed",
    });
  }
};

// Update live visitor heartbeat
const visitorHeartbeat = async (req: Request, res: Response) => {
  try {
    const { visitorId, sessionId, path } = req.body;

    if (
      typeof visitorId !== "string" ||
      visitorId.length > 100 ||
      typeof sessionId !== "string" ||
      sessionId.length > 100 ||
      typeof path !== "string" ||
      path.length > 500 ||
      !path.startsWith("/")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid heartbeat data",
      });
    }

    const now = new Date();

    await VisitorSession.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          visitorId,
          currentPath: path,
          lastSeenAt: now,
        },
      },
      { upsert: true },
    );

    await Visitor.updateOne(
      { visitorId },
      { $set: { lastSeenAt: now } },
    );

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Heartbeat error:", error);

    return res.status(500).json({
      success: false,
      message: "Heartbeat failed",
    });
  }
};


const getDhakaStartOfDay = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return new Date(
    Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
      -6,
    ),
  );
};


const getVisitorStats = async (req:Request, res:Response) => {
  try {
    const now = new Date();

    const todayStart = getDhakaStartOfDay();

    const liveThreshold = new Date(
      now.getTime() - 2 * 60 * 1000,
    );

    const sevenDaysAgo = new Date(
      todayStart.getTime() - 6 * 24 * 60 * 60 * 1000,
    );

    const [
      totalVisitors,
      totalPageViews,
      todayPageViews,
      todayVisitorsResult,
      liveVisitorsResult,
      dailyStats,
    ] = await Promise.all([
      Visitor.countDocuments(),

      PageView.countDocuments(),

      PageView.countDocuments({
        createdAt: { $gte: todayStart },
      }),

      PageView.aggregate([
        {
          $match: {
            createdAt: { $gte: todayStart },
          },
        },
        {
          $group: {
            _id: "$visitorId",
          },
        },
        {
          $count: "total",
        },
      ]),

      VisitorSession.aggregate([
        {
          $match: {
            lastSeenAt: { $gte: liveThreshold },
          },
        },
        {
          $group: {
            _id: "$visitorId",
          },
        },
        {
          $count: "total",
        },
      ]),

      PageView.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "Asia/Dhaka",
              },
            },
            visitors: { $addToSet: "$visitorId" },
            pageViews: { $sum: 1 },
          },
        },
        {
          $project: {
            date: "$_id",
            visitors: { $size: "$visitors" },
            pageViews: 1,
            _id: 0,
          },
        },
        { $sort: { date: 1 } },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      message: "Visitor statistics fetched successfully",
      data: {
        totalVisitors,
        totalPageViews,
        todayVisitors: todayVisitorsResult[0]?.total || 0,
        todayPageViews,
        liveVisitors: liveVisitorsResult[0]?.total || 0,
        dailyStats,
      },
    });
  } catch (error) {
    console.error("Visitor statistics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch visitor statistics",
    });
  }
};

export const visitorController = {
  trackPageView,
  visitorHeartbeat,
  getVisitorStats,
};