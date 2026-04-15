const PREFIX = "ethiotravel_profile:";

export function profileStorageKey(email) {
  return `${PREFIX}${(email || "").toLowerCase()}`;
}

const defaultProfile = () => ({
  fullName: "",
  nationality: "",
  age: "",
  gender: "",
  maritalOrSocialStatus: "",
  otherStatusDetail: "",
  passportNumber: "",
  phone: "",
  bio: "",
  travelHistorySummary: "",
  profilePhoto: "",
});

export function loadUserProfile(email) {
  if (typeof window === "undefined") return defaultProfile();
  try {
    const raw = localStorage.getItem(profileStorageKey(email));
    if (!raw) return defaultProfile();
    const p = JSON.parse(raw);
    return { ...defaultProfile(), ...p };
  } catch {
    return defaultProfile();
  }
}

export function saveUserProfile(email, data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(profileStorageKey(email), JSON.stringify(data));
}
