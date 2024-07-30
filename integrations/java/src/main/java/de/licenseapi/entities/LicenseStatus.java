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
     * Either the provided public key has been tampered with or the signature is invalid.
     */
    INVALID_SIGNATURE,

    /**
     * The license key is valid, but the license needs to be renewed.
     */
    RENEWAL_REQUIRED

}
