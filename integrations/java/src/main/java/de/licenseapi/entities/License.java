package de.licenseapi.entities;

import java.util.ArrayList;
import java.util.Date;

public class License {

    private final LicenseStatus status;
    private final String licenseKey;
    private final ArrayList<String> groups;
    private final ArrayList<String> permissions;
    private final ArrayList<LicenseMeta> meta;
    private final int maxUses;
    private final int currentUses;
    private final Date expirationDate;

    /**
     * Creates a new license object with the given parameters
     *
     * @param status         The status of the license
     * @param licenseKey     The license key
     * @param groups         The groups of the license
     * @param permissions    The permissions of the license
     * @param meta           The meta information of the license
     * @param maxUses        The maximum amount of uses of the license
     * @param currentUses    The current amount of uses of the license
     * @param expirationDate The expiration date of the license
     */
    public License(LicenseStatus status, String licenseKey, ArrayList<String> groups, ArrayList<String> permissions,
                   ArrayList<LicenseMeta> meta, int maxUses, int currentUses, Date expirationDate) {
        this.status = status;
        this.licenseKey = licenseKey;
        this.groups = groups;
        this.permissions = permissions;
        this.meta = meta;
        this.maxUses = maxUses;
        this.currentUses = currentUses;
        this.expirationDate = expirationDate;
    }

    /**
     * Gets the status of the license
     * <p>
     * The status can be one of the following:
     * </p>
     * <ul>
     *     <li>{@link LicenseStatus#VALID}</li>
     *     <li>{@link LicenseStatus#EXPIRED}</li>
     *     <li>{@link LicenseStatus#INVALID}</li>
     *     <li>{@link LicenseStatus#MAX_USES_REACHED}</li>
     * </ul>
     *
     * @return the status of the license
     */
    public LicenseStatus getStatus() {
        return status;
    }

    /**
     * Checks if the license is valid
     *
     * @return {@code true} if the license is valid and {@code false} if not
     */
    public boolean isValid() {
        return status == LicenseStatus.VALID;
    }

    /**
     * Checks if the license has expired
     *
     * @return {@code true} if the license has expired and {@code false} if not
     */
    public boolean isExpired() {
        return status == LicenseStatus.EXPIRED;
    }

    /**
     * Checks if the license has reached the maximum amount of uses (if the maximum amount of uses is set)
     *
     * @return {@code true} if the license has reached the maximum amount of uses and {@code false} if not
     */
    public boolean isMaxUsesReached() {
        return status == LicenseStatus.MAX_USES_REACHED;
    }

    /**
     * Gets the current license key. If the license key is invalid, this method will return {@code null}
     *
     * @return the current license key
     */
    public String getLicenseKey() {
        return licenseKey;
    }

    /**
     * Gets all groups of the license
     *
     * @return all groups of the license
     */
    public ArrayList<String> getGroups() {
        return groups;
    }

    /**
     * Checks if the license has a specific group
     *
     * @param group The group you want to check
     * @return {@code true} if the license has the group and {@code false} if not
     */
    public boolean hasGroup(String group) {
        return groups.contains(group);
    }

    /**
     * Gets all permissions of the license
     *
     * @return all permissions of the license
     */
    public ArrayList<String> getPermissions() {
        return permissions;
    }

    /**
     * Checks if the license has a specific permission
     *
     * @param permission The permission you want to check
     * @return {@code true} if the license has the permission and {@code false} if not
     */
    public boolean hasPermission(String permission) {
        return permissions.contains(permission);
    }

    /**
     * Gets all meta information of the license
     *
     * @return all meta information of the license
     */
    public ArrayList<LicenseMeta> getMeta() {
        return meta;
    }

    /**
     * Gets a specific meta information of the license. If the meta information does not exist, this method will return {@code null}
     *
     * @param key The key of the meta information you want to get
     * @return the value of the meta information
     */
    public String getMeta(String key) {
        for (LicenseMeta meta : getMeta()) {
            if (meta.getKey().equals(key)) return meta.getValue();
        }
        return null;
    }

    /**
     * Gets the maximum amount of uses of the license. If the maximum amount of uses is not set, this method will return {@code -1}
     *
     * @return the maximum amount of uses of the license
     */
    public int getMaxUses() {
        return maxUses;
    }

    /**
     * Gets the current amount of uses of the license
     *
     * @return the current amount of uses of the license
     */
    public int getCurrentUses() {
        return currentUses;
    }

    /**
     * Gets the expiration date of the license. If the license has no expiration date, this method will return {@code null}
     *
     * @return the expiration date of the license
     */
    public Date getExpirationDate() {
        return expirationDate;
    }
}
