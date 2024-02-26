export type Attendees = {
  client_name: string[] | null;
  organisor: string[];
  designer: string[];
  attendees: string[];
};

export type MomData = {
  mom_id: string;
  meetingdate: string;
  location: string;
  attendees: Attendees;
  remark: string;
  imaportant_note: string;
  files: any[]; // Add a proper type for files if needed
};

export type ApiResponse = {
  message: string;
  status: boolean;
  errorMessage: string;
  code: number;
  data: MomData[];
  subrow:ApiResponse[]
};

const parseQueryString = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const paramObject: Record<string, string> = {};
  
  for (const [key, value] of params.entries()) {
    paramObject[key] = value;
  }

  return paramObject;
};

// Get the query string from the window location
const queryString = window.location.search;

// Parse the query string to get an object of query parameters
const queryParams = parseQueryString(queryString);

// Access the value of a specific query parameter
export const projectId = queryParams.project_id;
console.log(projectId);

const response1 = await fetch(`http://35.200.251.213/v1/api/admin/getall/mom/?project_id=${projectId}`);
const jsonData1= await response1.json();
console.log(projectId);

export const ordersData =jsonData1.data
console.log(ordersData);

export const momApiResponse: ApiResponse  =jsonData1.data