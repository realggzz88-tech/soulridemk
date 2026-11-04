import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import AddGemPage from "@/pages/AddGemPage";
import { copy as licenceCopy } from "./licence-copy";
import { dailyLimit, NEW_ACCOUNT_DAILY_LIMIT, TRUSTED_ACCOUNT_DAILY_LIMIT } from "./limits";
import { fittedEdge } from "./photos";
import { distanceMeters, nearestSpot, zoneAt } from "./zones";
import { nameError, storyError, uploadTooLarge, PHOTO_UPLOAD_MAX_BYTES, formatMegabytes } from "./validate";
import { toSubmission } from "./client";
import { DraftSaveError, clearGemDraft, loadGemDraft, previewHarnessEnabled, saveGemDraft } from "./draft";
import { altError } from "./validate";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: null, loading: false }),
}));

describe("gem rules", () => {
  it("blocks a strict reserve and only warns in other protected areas", () => {
    expect(zoneAt(40.9668, 21.0402)?.kind).toBe("strict");
    expect(zoneAt(41.1897, 20.7965)?.kind).toBe("protected");
    expect(zoneAt(41.99, 21.43)).toBeNull();
  });

  it("flags a catalog spot within 150 m", () => {
    const near = nearestSpot(41.0304, 20.7506);
    expect(near).not.toBeNull();
    expect(near!.meters).toBeLessThanOrEqual(150);
    expect(distanceMeters(41, 21, 42, 22)).toBeGreaterThan(1000);
  });

  it("validates the name, story and upload size", () => {
    expect(nameError("аб")).toBe("required");
    expect(nameError("Видиковец")).toBeNull();
    expect(storyError("кратко")).toBe("length");
    expect(storyError("Јави се на 070 123 456 веднаш за да резервираш место тука.")).toBe("banned");
    expect(uploadTooLarge(PHOTO_UPLOAD_MAX_BYTES + 1)).toBe(true);
    expect(fittedEdge(4000, 2000, 2000)).toEqual({ width: 2000, height: 1000 });
  });

  it("uses a non-exclusive licence and the 3/10 daily caps", () => {
    expect(licenceCopy).not.toMatch(/CC BY-SA/i);
    expect(licenceCopy).toMatch(/неексклузивна/);
    expect(dailyLimit(false)).toBe(NEW_ACCOUNT_DAILY_LIMIT);
    expect(dailyLimit(true)).toBe(TRUSTED_ACCOUNT_DAILY_LIMIT);
  });

  it("keeps a submission pending for review", () => {
    const row = toSubmission({
      name: "Видиковец",
      category: "nature",
      subcategories: ["viewpoint"],
      altMk: "Поглед кон езерото",
      altEn: "View of the lake",
      seasons: ["summer"],
      story: "Од превојот се гледа целото езеро и патот е тесен на последните километри.",
      storyLang: "mk",
      lat: 41.19,
      lng: 20.8,
      photos: [{ name: "a.webp", type: "image/webp", bytes: 1200, width: 800, height: 600 }],
      ownWork: true,
      licence: "non-exclusive",
      privacy: true,
    });
    expect(row.status).toBe("pending");
    expect(row.description_en_status).toBe("machine");
    expect(row.description_mk_status).toBe("author");
  });

  it("requires cover alt text in both languages and keeps a draft on the device", async () => {
    expect(altError("")).toBe("required");
    expect(altError("Поглед")).toBeNull();
    localStorage.clear();
    await saveGemDraft({
      savedAt: "2026-11-04T00:00:00.000Z",
      lat: 41.1,
      lng: 20.8,
      name: "Видиковец",
      category: "nature",
      subcategories: ["viewpoint"],
      altMk: "Поглед",
      altEn: "View",
      story: "Од превојот се гледа целото езеро и патот е тесен на последните километри.",
      storyLang: "mk",
      seasons: ["spring", "autumn"],
      own: true,
      licence: true,
      privacy: true,
      photos: [],
    });
    const loaded = await loadGemDraft();
    expect(loaded?.subcategories).toEqual(["viewpoint"]);
    expect(loaded?.seasons).toEqual(["spring", "autumn"]);
    expect(previewHarnessEnabled(false, "review")).toBe(false);
    expect(previewHarnessEnabled(true, "review")).toBe(true);
    expect(previewHarnessEnabled(true, "signin")).toBe(false);
    expect(formatMegabytes(22_800_000)).toBe("22,8");
    await clearGemDraft();
    expect(localStorage.getItem("soulride.gem-draft")).toBeNull();
  });

  it("reports a failed draft save instead of throwing QuotaExceededError", async () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("quota", "QuotaExceededError");
    });
    await expect(
      saveGemDraft({
        savedAt: "2026-11-04T00:00:00.000Z",
        lat: 41,
        lng: 21,
        name: "Име",
        category: "nature",
        subcategories: [],
        altMk: "Поглед",
        altEn: "View",
        story: "Од превојот се гледа целото езеро и патот е тесен на последните километри.",
        storyLang: "mk",
        seasons: [],
        own: true,
        licence: true,
        privacy: true,
        photos: [],
      }),
    ).rejects.toBeInstanceOf(DraftSaveError);
    setItem.mockRestore();
  });
});

describe("add gem location", () => {
  it("does not request geolocation until the button is pressed", () => {
    const spy = vi.fn();
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition: spy },
    });
    render(
      <MemoryRouter initialEntries={["/suggest?state=location"]}>
        <Routes>
          <Route path="/suggest" element={<AddGemPage signedIn />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(spy).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Користи ја мојата локација" }));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("disables continue inside a strict reserve", () => {
    render(
      <MemoryRouter initialEntries={["/suggest?state=location-blocked"]}>
        <Routes>
          <Route path="/suggest" element={<AddGemPage signedIn />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole("button", { name: "Продолжи" })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent("Езерани");
  });

  it("shows a 30-day appeal on my suggestions", () => {
    render(
      <MemoryRouter initialEntries={["/suggest?state=pending"]}>
        <Routes>
          <Route path="/suggest" element={<AddGemPage signedIn />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText(/30 дена/)).toBeInTheDocument();
    expect(screen.queryByText(/6 месеци/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Поднеси жалба" })).toBeInTheDocument();
    expect(screen.queryByText("Пештера Врело")).not.toBeInTheDocument();
  });

  it("starts empty and keeps the demo spot inside the dev preview only", () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={["/suggest"]}>
        <Routes>
          <Route path="/suggest" element={<AddGemPage signedIn />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.queryByDisplayValue("Видиковец над Трпејца")).not.toBeInTheDocument();
    expect(screen.queryByText(/Од превојот се гледа/)).not.toBeInTheDocument();
    unmount();
    render(
      <MemoryRouter initialEntries={["/suggest?state=details"]}>
        <Routes>
          <Route path="/suggest" element={<AddGemPage signedIn />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByDisplayValue("Видиковец над Трпејца")).toBeInTheDocument();
  });

  it("shows per-photo progress and the upload-failed state", () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={["/suggest?state=photos-compress"]}>
        <Routes>
          <Route path="/suggest" element={<AddGemPage signedIn />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText(/Компресирање 64%/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Се компресира…" })).toBeDisabled();
    unmount();
    render(
      <MemoryRouter initialEntries={["/suggest?state=upload-failed"]}>
        <Routes>
          <Route path="/suggest" element={<AddGemPage signedIn />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText(/Нема интернет/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Се прикачува… 1 од 3" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Обиди се пак" })).toBeInTheDocument();
  });
});
