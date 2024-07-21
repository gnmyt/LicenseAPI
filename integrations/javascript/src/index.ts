import { License, LicenseStatus } from "./entities/License";
import { LicenseMeta } from "./entities/LicenseMeta";

export class LicenseValidator {
    private readonly API_VERSION = 1;
    private readonly baseUrl: string;
    private readonly validationKey: string;
    private retries: number = 3;

    constructor(baseUrl: string, validationKey: string) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        this.validationKey = validationKey;
    }

    private async retrieveLicenseRaw(licenseKey: string): Promise<string | null> {
        const url = `${this.baseUrl}/api/v${this.API_VERSION}/validate/${encodeURIComponent(licenseKey)}`;
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "User-Agent": "LicenseAPI-Java-Client",
                    "X-Validation-Key": this.validationKey,
                },
            });
            if (response.ok) return response.text();
            console.warn(`Failed to retrieve license. Status: ${response.status}`);
        } catch (error) {
            console.error("Error retrieving license:", error);
        }
        return null;
    }

    private async retry<T>(fn: () => Promise<T | null>, retries: number): Promise<T | null> {
        let result: T | null = await fn();
        let attempts = 0;

        while (!result && attempts < retries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            result = await fn();
            attempts++;
        }

        return result;
    }

    private parseLicense(status: LicenseStatus, license: any): License {
        if (status !== LicenseStatus.VALID) {
            return new License(status, "", [], [], [], -1, 0, null);
        }

        const licenseKey = license.key || "";
        const groups = license.groups || [];
        const permissions = license.permissions || [];
        const meta = Object.keys(license.meta || {}).map(key => new LicenseMeta(key, license.meta[key]));
        const maxUses = license.maxUses || -1;
        const currentUses = license.currentUses || 0;
        const expirationDate = license.expirationDate ? new Date(license.expirationDate) : null;

        return new License(status, licenseKey, groups, permissions, meta, maxUses, currentUses, expirationDate);
    }

    public async retrieveLicense(licenseKey: string): Promise<License | null> {
        const response = await this.retry(() => this.retrieveLicenseRaw(licenseKey), this.retries);
        if (!response) return null;

        const object = JSON.parse(response);
        const status = LicenseStatus[object.status as keyof typeof LicenseStatus] || LicenseStatus.INVALID;

        if (status === LicenseStatus.INVALID) return null;

        return this.parseLicense(status, object.license);
    }

    public setRetries(retries: number): void {
        this.retries = retries;
    }

    public getRetries(): number {
        return this.retries;
    }

    public getValidationKey(): string {
        return this.validationKey;
    }
}
