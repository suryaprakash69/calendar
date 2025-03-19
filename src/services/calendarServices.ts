import { EventData } from "../types/calendar"; 

const getCalendar = async (): Promise<EventData[]> => {
  const getCalendarMockData: EventData[] = [
    {
      id: 1,
      summary: "1st Round",
      desc: "1st Round",
      start: "2025-03-21T18:00:00+05:30",
      end: "2025-03-21T18:40:00+05:30",
      attendees: null,
      status: null,
      comment: null,
      score: {
        p: 8,
      },
      link: "http://www.hhh.com",
      user_det: {
        id: 1,
        question_score: null,
        status: null,
        candidate: {
          id: 1,
          candidate_firstName: "mohan",
          candidate_lastName: "raj",
          candidateGender: "male",
          candidateComment: "",
          candidate_email: "mohanrajk@dataterrain.com",
        },
        handled_by: {
          id: 3,
          last_login: null,
          userEmail: "vinodhini_hr@dataterrain.com",
          username: "vinodhini_hr",
          firstName: "Vinodhini",
          lastName: "HR",
          userRole: "hr_employee",
        },
        job_id: {
          id: 11,
          jobRequest_Title: "django developer",
          jobRequest_Role: "software engineer",
          jobRequest_KeySkills: "django",
          jobRequest_Description: "asfffasf",
        },
      },
      job_id: {
        id: 11,
        jobRequest_Title: "django developer",
        jobRequest_Role: "software engineer",
        jobRequest_KeySkills: "django",
        jobRequest_Description: "asfffasf",
      },
    },
    {
      id: 2,
      summary: "Test",
      desc: "1nd Round",
      start: "2025-03-19T20:00:00+05:30",
      end: "2025-03-19T21:00:00+05:30",
      attendees: null,
      status: null,
      comment: null,
      score: {
        p: 7,
      },
      link: "http://www.hhh.com",
      user_det: {
        id: 1,
        question_score: null,
        status: null,
        candidate: {
          id: 1,
          candidate_firstName: "mohan",
          candidate_lastName: "raj",
          candidateGender: "male",
          candidateComment: "",
          candidate_email: "mohanrajk@dataterrain.com",
        },
        handled_by: {
          id: 3,
          last_login: null,
          userEmail: "vinodhini_hr@dataterrain.com",
          username: "vinodhini_hr",
          firstName: "Vinodhini",
          lastName: "HR",
          userRole: "hr_employee",
        },
        job_id: {
          id: 11,
          jobRequest_Title: "django developer",
          jobRequest_Role: "software engineer",
          jobRequest_KeySkills: "django",
          jobRequest_Description: "asfffasf",
        },
      },
      job_id: {
        id: 11,
        jobRequest_Title: "django developer",
        jobRequest_Role: "software engineer",
        jobRequest_KeySkills: "django",
        jobRequest_Description: "asfffasf",
      },
    },
    {
      id: 3,
      summary: "2nd Round",
      desc: "2nd Round",
      start: "2025-03-19T20:00:00+05:30",
      end: "2025-03-19T21:00:00+05:30",
      attendees: null,
      status: null,
      comment: null,
      score: {
        p: 6,
      },
      link: "http://www.hhh.com",
      user_det: {
        id: 1,
        question_score: null,
        status: null,
        candidate: {
          id: 1,
          candidate_firstName: "mohan",
          candidate_lastName: "raj",
          candidateGender: "male",
          candidateComment: "",
          candidate_email: "mohanrajk@dataterrain.com",
        },
        handled_by: {
          id: 3,
          last_login: null,
          userEmail: "vinodhini_hr@dataterrain.com",
          username: "vinodhini_hr",
          firstName: "Vinodhini",
          lastName: "HR",
          userRole: "hr_employee",
        },
        job_id: {
          id: 11,
          jobRequest_Title: "django developer",
          jobRequest_Role: "software engineer",
          jobRequest_KeySkills: "django",
          jobRequest_Description: "asfffasf",
        },
      },
      job_id: {
        id: 11,
        jobRequest_Title: "django developer",
        jobRequest_Role: "software engineer",
        jobRequest_KeySkills: "django",
        jobRequest_Description: "asfffasf",
      },
    },
  ];

  return getCalendarMockData;
};

export default {
  getCalendar,
};
