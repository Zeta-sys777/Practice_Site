import { useQuery } from "@tanstack/react-query";
import { getDirections, getDirection } from "../api/directions";

export const useDirections = () =>
  useQuery({ queryKey: ["directions"], queryFn: getDirections });

export const useDirection = (slug: string) =>
  useQuery({
    queryKey: ["direction", slug],
    queryFn: () => getDirection(slug),
    enabled: !!slug,
  });
