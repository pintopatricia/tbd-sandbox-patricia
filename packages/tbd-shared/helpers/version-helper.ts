const parseVersion = (version: string): Array<number | string> => {
  const SEGMENT_REGEX = /^(\d+)([a-zA-Z]*)$/;
  const segments = [];
  const parts = version.split(".");

  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    const match = part.match(SEGMENT_REGEX);

    if (match) {
      const num = parseInt(match[1], 10);
      const suffix = match[2];
      segments.push(num);

      if (suffix) segments.push(suffix);
    } else {
      segments.push(part);
    }
  }

  return segments;
};

/**
 * Compares two version strings to determine if the current version is greater than or equal to the minimum required version.
 *
 * Handles version strings with numeric and alphanumeric segments (e.g., "12.1.0", "12b.1.0").
 * Returns true if the current version is greater than or equal to the minimum version, false otherwise.
 *
 * @param {string} currentVersion - The current version string (e.g., "12.1.0", "12b.1.0").
 * @param {string} minVersion - The minimum required version string.
 * @returns {boolean} True if currentVersion >= minVersion, false otherwise.
 */
export function isVersionSupported(currentVersion: string, minVersion: string): boolean {
  if (!currentVersion || !minVersion) return false;

  const currentSegments = parseVersion(currentVersion);
  const minimumSegments = parseVersion(minVersion);
  const segmentCount = Math.max(currentSegments.length, minimumSegments.length);

  for (let i = 0; i < segmentCount; i += 1) {
    const currentSegment = currentSegments[i] ?? 0;
    const minimumSegment = minimumSegments[i] ?? 0;

    if (typeof currentSegment === "number" && typeof minimumSegment === "number") {
      if (currentSegment > minimumSegment) return true;
      if (currentSegment < minimumSegment) return false;
    }

    if (typeof currentSegment === "number" && typeof minimumSegment === "string") return true;
    if (typeof currentSegment === "string" && typeof minimumSegment === "number") return false;

    if (typeof currentSegment === "string" && typeof minimumSegment === "string") {
      if (currentSegment > minimumSegment) return true;
      if (currentSegment < minimumSegment) return false;
    }
  }

  return true;
}
