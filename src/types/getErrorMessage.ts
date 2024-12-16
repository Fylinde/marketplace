import type { AxiosError } from "axios";


export function getErrorMessage(error: unknown): string {
    if ((error as AxiosError).response) {
      return (error as AxiosError).response?.data?.message || (error as AxiosError).message;
    } else if (error instanceof Error) {
      return error.message;
    }
    return "An unknown error occurred";
  }
  