// types/calendar.ts
export interface EventData {
  id: number;
  summary: string;
  desc: string;
  start: string;
  end: string;
  attendees: null;
  status: null;
  comment: null;
  score: {
    p: number;
  };
  link: string;
  user_det: {
    id: number;
    question_score: null;
    status: null;
    candidate: {
      id: number;
      candidate_firstName: string;
      candidate_lastName: string;
      candidateGender: string;
      candidateComment: string;
      candidate_email: string;
    };
    handled_by: {
      id: number;
      last_login: null;
      userEmail: string;
      username: string;
      firstName: string;
      lastName: string;
      userRole: string;
    };
    job_id: {
      id: number;
      jobRequest_Title: string;
      jobRequest_Role: string;
      jobRequest_KeySkills: string;
      jobRequest_Description: string;
    };
  };
  job_id: {
    id: number;
    jobRequest_Title: string;
    jobRequest_Role: string;
    jobRequest_KeySkills: string;
    jobRequest_Description: string;
  };
}