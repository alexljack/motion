import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export type MeasurementType =
  | "weight"
  | "body-fat"
  | "muscle-mass"
  | "chest"
  | "waist"
  | "hips"
  | "bicep"
  | "thigh"
  | "neck"
  | "forearm"
  | "calf";

export interface BodyMeasurement {
  _id: string;
  user: string;
  measurementType: MeasurementType;
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

export interface TrendDataPoint {
  date: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface MeasurementTrends {
  measurementType: MeasurementType;
  period: string;
  data: TrendDataPoint[];
  summary: {
    latest: number;
    earliest: number;
    totalChange: number;
    totalChangePercent: number | string;
    dataPoints: number;
  };
}

export const useBodyMeasurements = (params?: {
  measurementType?: MeasurementType;
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

export const useCreateBodyMeasurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<BodyMeasurement>) => {
      const response = await axios.post("/api/body-measurements", data);
      return response.data as BodyMeasurement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["body-measurements"] });
      queryClient.invalidateQueries({ queryKey: ["measurement-trends"] });
    },
  });
};

export const useLatestBodyMeasurement = (measurementType: MeasurementType) => {
  return useQuery({
    queryKey: ["body-measurements", "latest", measurementType],
    queryFn: async () => {
      const response = await axios.get("/api/body-measurements", {
        params: { measurementType, limit: 1 },
      });
      const data = response.data as BodyMeasurement[];
      return data[0] ?? null;
    },
    enabled: !!measurementType,
  });
};

export const useUpdateBodyMeasurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BodyMeasurement> }) => {
      const response = await axios.put(`/api/body-measurements/${id}`, data);
      return response.data as BodyMeasurement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["body-measurements"] });
      queryClient.invalidateQueries({ queryKey: ["measurement-trends"] });
    },
  });
};

export const useDeleteBodyMeasurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/body-measurements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["body-measurements"] });
      queryClient.invalidateQueries({ queryKey: ["measurement-trends"] });
    },
  });
};

export const useMeasurementTrends = (
  measurementType: MeasurementType,
  period: string = "6m"
) => {
  return useQuery({
    queryKey: ["measurement-trends", measurementType, period],
    queryFn: async () => {
      const response = await axios.get(
        `/api/body-measurements/trends/${measurementType}`,
        { params: { period } }
      );
      return response.data as MeasurementTrends;
    },
    enabled: !!measurementType,
  });
};
