const API = process.env.NEXT_PUBLIC_BASE_API_URL;

if (!API) {
  throw new Error("NEXT_PUBLIC_BASE_API_URL not defined");
}

export default API;