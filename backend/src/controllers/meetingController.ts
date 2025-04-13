import { Request, Response } from "express";
import {
  getMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getMeeting,
} from "../services/meetingService";
import { sendResponse } from "../middlewares/sendResponse";
import { globalResponseCodes } from "../services/responseCode";
import {
  scheduleMeetingReminder,
  sendMeetingCreatedEmail,
} from "../services/emailService";
import { AuthenticatedRequest } from "../middlewares/auth";
import User from "../models/user";

export const handleGetMeetings = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = parseInt((req.query.limit as string) || "10", 10);
  const filter = (req.query.filter as string) || "";

  // Get user ID from authenticated request
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({
      Error: true,
      errorMessage: "Unauthorized",
      responseCode: globalResponseCodes.UNAUTHORIZED,
    });
    return;
  }

  try {
    const { meetings, totalPages } = await getMeetings(page, limit, filter, userId);
    res.status(200).json({
      Success: true,
      responseMessage: "Sucessful!",
      responseCode: globalResponseCodes.SUCCESSFUL,
      data: meetings,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      Error: true,
      errorMessage: "Internal Server Error",
      responseCode: globalResponseCodes.INTERNAL_SERVER_REQUEST,
    });
  }
};

export const handleGetMeeting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const meeting = await getMeeting(id);
    if (!meeting) {
      res.status(404).json({
        Error: true,
        errorMessage: "Meeting not found",
        responseCode: globalResponseCodes.NOT_FOUND,
      });
      return;
    }
    res.status(200).json({
      Success: true,
      responseMessage: "Sucessful!",
      responseCode: globalResponseCodes.SUCCESSFUL,
      data: meeting,
    });
  } catch (error) {
    res.status(500).json({
      Error: true,
      errorMessage: "Internal Server Error",
      responseCode: globalResponseCodes.INTERNAL_SERVER_REQUEST,
    });
  }
};

export const handleCreateMeeting = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const email = req.user?.email;
    // console.log("req.user:", { userId, email });

    if (!userId || !email) {
      res.status(401).json({ Error: true, errorMessage: "Unauthorized", responseCode: globalResponseCodes.UNAUTHORIZED });
      return;
    }

    const data = req.body;
    if (!data.title || !data.startTime || !data.endTime || !data.participants) {
      res.status(400).json({
        Error: true,
        errorMessage: "All fields are required",
        responseCode: globalResponseCodes.BAD_REQUEST,
      });
      return;
    }

    // Add the userId to the meeting data
    data.userId = userId;
    // console.log("Request:",req)
    const newMeeting = await createMeeting(data);
    // console.log('New meeting created:', newMeeting);

    // Debug: Check what user data we have
    // console.log('User data in create meeting:', req.user);

    // Get user email from the updated req.user object
    // const userEmail = req.user?.email;
    // console.log(req.user)
    // if (!userEmail) {
    //   res
    //     .status(401)
    //     .json({ Error: true, errorMessage: "User email not found" });
    //   return;
    // }

    // Send creation email
    await sendMeetingCreatedEmail(email, newMeeting);

    // Schedule reminder 10 minutes before
    scheduleMeetingReminder(email, newMeeting);

    res.status(201).json({
      Success: true,
      responseMessage: "New meeting created!",
      responseCode: globalResponseCodes.CREATED,
      data: newMeeting,
    });
  } catch (error) {
    console.error("Error in handleCreateMeeting:", error);
    res.status(500).json({
      Error: true,
      errorMessage: "Meeting not created",
      responseCode: globalResponseCodes.INTERNAL_SERVER_REQUEST,
    });
  }
};

export const handleUpdateMeeting = async (req: Request, res: Response) => {
  try {
    // debugger
    // console.log('PUT Request Received');
    // console.log('Received ID:', id);
    // console.log('Raw Body:', body);

    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        Error: true,
        errorMessage: "Meeting ID required",
        responseCode: globalResponseCodes.BAD_REQUEST,
      });
      return;
    }

    if (!req.body) {
      res.status(400).json({
        Error: true,
        errorMessage: "Request body is missing",
        responseCode: globalResponseCodes.BAD_REQUEST,
      });
      return;
    }

    const parsedBody = req.body;
    if (Object.keys(parsedBody).length === 0) {
      res.status(400).json({
        Error: true,
        errorMessage: "No valid fields provided for update",
        responseCode: globalResponseCodes.BAD_REQUEST,
      });
      return;
    }

    const updatedMeeting = await updateMeeting(id, parsedBody);
    if (!updatedMeeting) {
      res.status(404).json({
        Error: true,
        errorMessage: "Meeting not found",
        responseCode: globalResponseCodes.NOT_FOUND,
      });
      return;
    }

    res.status(200).json({
      Success: true,
      responseMessage: "Meeting updated successfully!",
      responseCode: globalResponseCodes.SUCCESSFUL,
      data: updatedMeeting,
    });
  } catch (error) {
    res.status(500).json({
      Error: true,
      errorMessage: "Meeting not updated",
      responseCode: globalResponseCodes.INTERNAL_SERVER_REQUEST,
    });
  }
};

export const handleDeleteMeeting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedMeeting = await deleteMeeting(id);
    if (!deletedMeeting) {
      res.status(404).json({
        Error: true,
        errorMessage: "Meeting not found",
        responseCode: globalResponseCodes.NOT_FOUND,
      });
      return;
    }
    res.status(200).json({
      Success: true,
      responseMessage: "Meeting deleted successfully!",
      responseCode: globalResponseCodes.SUCCESSFUL,
    });
  } catch (error) {
    res.status(500).json({
      Error: true,
      errorMessage: "Meeting not deleted",
      responseCode: globalResponseCodes.INTERNAL_SERVER_REQUEST,
    });
  }
};
