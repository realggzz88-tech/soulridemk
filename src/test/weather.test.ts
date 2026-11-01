import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { buildMockWeather, getRidingAdvice, useWeather } from "@/hooks/use-weather";
import { isOpenWeatherConfigured } from "@/lib/public-env";

describe("OpenWeather configuration", () => {
  it("treats missing, blank, and placeholder keys as unset", () => {
    expect(isOpenWeatherConfigured(undefined)).toBe(false);
    expect(isOpenWeatherConfigured("")).toBe(false);
    expect(isOpenWeatherConfigured("   ")).toBe(false);
    expect(isOpenWeatherConfigured("YOUR_API_KEY")).toBe(false);
    expect(isOpenWeatherConfigured("real-key")).toBe(true);
  });
});

describe("riding advice", () => {
  it("warns for rain, wind, and heat before falling back to a general note", () => {
    expect(getRidingAdvice("light rain", 18, 2)).toMatch(/Wet roads/i);
    expect(getRidingAdvice("Clear", 22, 12)).toMatch(/Strong winds/i);
    expect(getRidingAdvice("Clear", 34, 1)).toMatch(/Hot day/i);
    expect(getRidingAdvice("Clear", 20, 2)).toMatch(/Perfect riding weather/i);
    expect(getRidingAdvice("Mist", 10, 1)).toMatch(/Low visibility/i);
  });
});

describe("weather fallback", () => {
  it("builds the same estimate for the same coordinates", () => {
    expect(buildMockWeather(41.03, 20.75)).toEqual(buildMockWeather(41.03, 20.75));
    expect(buildMockWeather(41.03, 20.75).temp).not.toBe(buildMockWeather(42.0, 22.0).temp);
  });

  it("does not call OpenWeather when no key is configured", async () => {
    if (isOpenWeatherConfigured()) return;

    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { result } = renderHook(() => useWeather(41.03, 20.75));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.weather).toEqual(buildMockWeather(41.03, 20.75));
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
