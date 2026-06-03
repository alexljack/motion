import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface BodyMeasurement {
  _id: string;
  user: string;
  measurementType: string;
  value: number;
  unit: string;
  measuredDate: string;
  timeOfDay?: string;
  conditions?: string;
  notes?: string;
  photoUrl?: string;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  createdAt: string;
  updatedAt: string;
}

// Get body measurements
export const useBodyMeasurements = (params?: {
  measurementType?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["body-measurements", params],
    queryFn: async () => {
      const response = await axios.get("/api/body-measurements", { params });
      return response.data as BodyMeasurement[];
    },
  });
};

// Create body measurement
export const useCreateBodyMeasurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<BodyMeasurement>) => {
      const response = await axios.post("/api/body-measurements", data);
      return response.data as BodyMeasurement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["body-measurements"] });
    },
  });
};

// Get measurement trends
export const useMeasurementTrends = (
  measurementType: string,
  period: string = "6m"
) => {
  return useQuery({
    queryKey: ["measurement-trends", measurementType, period],
    queryFn: async () => {
      const response = await axios.get(
        `/api/body-measurements/trends/${measurementType}`,
        { params: { period } }
      );
      return response.data;
    },
    enabled: !!measurementType,
  });
};
