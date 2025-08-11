import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000", // NestJS API 주소
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;

