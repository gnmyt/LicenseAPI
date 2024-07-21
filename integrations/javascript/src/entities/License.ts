export enum LicenseStatus {
    VALID = "VALID",
    EXPIRED = "EXPIRED",
    INVALID = "INVALID",
    MAX_USES_REACHED = "MAX_USES_REACHED",
}

export interface LicenseMeta {
    key: string;
    value: string;
    getAsInteger(): number;
    getAsDouble(): number;
    getAsBoolean(): boolean;
}

export class License {
    public readonly status: LicenseStatus;
    public readonly licenseKey: string;
    public readonly groups: string[];
    public readonly permissions: string[];
    public readonly meta: LicenseMeta[];
    public readonly maxUses: number;
    public readonly currentUses: number;
    public readonly expirationDate: Date | null;

    constructor(
        status: LicenseStatus,
        licenseKey: string,
        groups: string[],
        permissions: string[],
        meta: LicenseMeta[],
        maxUses: number,
        currentUses: number,
        expirationDate: Date | null
    ) {
        this.status = status;
        this.licenseKey = licenseKey;
        this.groups = groups;
        this.permissions = permissions;
        this.meta = meta;
        this.maxUses = maxUses;
        this.currentUses = currentUses;
        this.expirationDate = expirationDate;
    }

    public isValid(): boolean {
        return this.status === LicenseStatus.VALID;
    }

    public isExpired(): boolean {
        return this.status === LicenseStatus.EXPIRED;
    }

    public isMaxUsesReached(): boolean {
        return this.status === LicenseStatus.MAX_USES_REACHED;
    }

    public getMeta(key: string): string | null {
        const meta = this.meta.find(m => m.key === key);
        return meta ? meta.value : null;
    }

    public hasGroup(group: string): boolean {
        return this.groups.includes(group);
    }

    public hasPermission(permission: string): boolean {
        return this.permissions.includes(permission);
    }
}
