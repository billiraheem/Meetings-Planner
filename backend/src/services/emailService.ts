import nodemailer from "nodemailer";
import * as dotenv from 'dotenv';
// import Meeting from "../models/meeting";

dotenv.config();

interface MeetingData {
  title: string;
  startTime: Date;
  endTime: Date;
  participants: string[];
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, //587,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter setup (optional, for debugging)
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email transporter ready');
  }
});

// Email when meeting is created
export const sendMeetingCreatedEmail = async (email: string, meeting: MeetingData) => {

  const formattedStartTime = meeting.startTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const formattedEndTime = meeting.endTime.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Meeting created: ${meeting.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2>Your meeting has been scheduled</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #333;">${meeting.title}</h3>
          <p><strong>When:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
          <p><strong>Participants:</strong> ${meeting.participants.join(', ')} </p>
        </div>
        <p>You will receive a reminder 10 minutes before the meeting starts.</p>
        <p>Thank you for using our service!</p>
      </div>
    `,
  });
  console.log(`Creation email sent to ${email}`);
};

// Reminder email 10 minutes before meeting
export const sendMeetingReminderEmail = async (email: string, meeting: MeetingData) => {
  const formattedStartTime = meeting.startTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Reminder: ${meeting.title} starts in 10 minutes`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2>Meeting Reminder</h2>
        <div style="background-color: #f8f0e3; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #d35400;">Your meeting starts in 10 minutes!</h3>
          <h4 style="color: #333;">${meeting.title}</h4>
          <p><strong>Time:</strong> ${formattedStartTime}</p>
        </div>
        <p>We hope you have a productive meeting!</p>
      </div>
    `,
  });
  console.log(`Reminder email sent to ${email}`);
}

// Schedule reminder email
export const scheduleMeetingReminder = (email: string, meeting: MeetingData) => {
  const startTime = new Date(meeting.startTime).getTime();
  const now = Date.now();
  const tenMinutesBefore = startTime - 10 * 60 * 1000; // 10 minutes in milliseconds
  const delay = tenMinutesBefore - now;

  // Don't schedule if the meeting starts in less than 10 minutes
  // if (delay <= 0) {
  //   console.log(`Meeting ${meeting.title} starts too soon for a reminder`);
  //   return;
  // }

  // console.log(`Scheduling reminder for meeting ${meeting.title} to be sent in ${Math.floor(delay / 60000)} minutes`);

  if (delay > 0) {
    setTimeout(async () => {
      try {
        await sendMeetingReminderEmail(email, meeting)
          .then(() => console.log(`Reminder sent for meeting ${meeting.title}`))
          .catch(error => console.error(`Failed to send reminder for meeting ${meeting.title}:`, error));
      } catch (error) {
        console.error('Error sending reminder email:', error);
      }
    }, delay);
    console.log(`Reminder scheduled for ${email} at ${new Date(tenMinutesBefore).toLocaleString()}`);
  } else {
    console.log(`Meeting ${meeting.title} starts in less than 10 minutes, no reminder scheduled`);
  }
}