import { supabase } from "@/supabase";

export async function evaluateAircraftAirport(aircraftId, airportId) {
  const { data, error } = await supabase.rpc("evaluate_aircraft_airport", {
    p_aircraft_id: aircraftId,
    p_airport_id: airportId,
  });

  if (error) {
    console.error("[Eligibility RPC Error]", error);
    throw error;
  }

  return data?.[0] ?? null;
}

export const getWorstOperationalStatus = (statuses) => {
  if (statuses.includes("BLOCKED")) return "BLOCKED";
  if (statuses.includes("PERFORMANCE_REQUIRED")) return "PERFORMANCE_REQUIRED";
  return "ALLOWED_WITH_VALIDATION";
};

export async function evaluateAircraftRoute(
  aircraftId,
  originAirportId,
  destinationAirportId,
) {
  const [origin, destination] = await Promise.all([
    evaluateAircraftAirport(aircraftId, originAirportId),
    evaluateAircraftAirport(aircraftId, destinationAirportId),
  ]);

  const originStatus = origin?.resultado_operacional ?? "BLOCKED";
  const destinationStatus = destination?.resultado_operacional ?? "BLOCKED";
  const routeStatus = getWorstOperationalStatus([originStatus, destinationStatus]);

  return {
    origin,
    destination,
    routeStatus,
  };
}
