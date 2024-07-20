package de.licenseapi.entities;

public enum LicenseStatus {

    /**
     * The provided license key is valid and can be used.
     */
    VALID,

    /**
     * The provided license key is valid, but the license is expired.
     */
    EXPIRED,

    /**
     * The provided license key is not valid.
     */
    INVALID,

    /**
     * The provided license key has reached the maximum amount of uses.
     */
    MAX_USES_REACHED

}
