package de.licenseapi;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import de.licenseapi.entities.License;
import de.licenseapi.entities.LicenseStatus;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.security.PublicKey;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

public class OfflineValidator extends LicenseValidator {

    private final PublicKey publicKey;

    /**
     * Creates a new offline validator
     *
     * @param publicKey The public key
     */
    public OfflineValidator(String publicKey) {
        try {
            this.publicKey = keyFromString(publicKey);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid public key");
        }
    }

    /**
     * Retrieves the license from the license object, which can be obtained from the server.
     * This will also run the signature verification and check if the license is expired.
     *
     * @param licenseObject The license object
     * @return The license object represented as a {@link License}
     */
    public License retrieveLicenseFromString(String licenseObject) {
        if (licenseObject == null) return null;

        String base64 = licenseObject.replaceAll("(-----(BEGIN|END) LICENSE KEY-----|[\n\r])", "");

        JsonObject object = JsonParser.parseString(new String(Base64.getDecoder().decode(base64),
                StandardCharsets.UTF_8)).getAsJsonObject();

        if (publicKey != null) {
            String signature = object.get("signature").getAsString();
            JsonObject data = object.getAsJsonObject("data");


            try {
                if (!verifyLicense(publicKey, signature, data.toString())) {
                    return new License(LicenseStatus.INVALID_SIGNATURE, null, null, null, null, 0, null);
                }

                Instant instant = Instant.from(DateTimeFormatter.ISO_INSTANT.parse(data.get("renewalDate").getAsString()));

                if (Instant.now().isAfter(instant)) {
                    return new License(LicenseStatus.RENEWAL_REQUIRED, null, null, null, null, 0, null);
                }

                return parseLicense(data);
            } catch (Exception e) {
                return new License(LicenseStatus.INVALID_SIGNATURE, null, null, null, null, 0, null);
            }
        } else {
            return parseLicense(object);
        }
    }

    /**
     * Retrieves the license from the license file
     *
     * @param licenseFile The license file
     * @return The license object represented as a {@link License}
     */
    public License retrieveLicenseFromFile(File licenseFile) {
        try {
            return retrieveLicenseFromString(new String(Files.readAllBytes(licenseFile.toPath()), StandardCharsets.UTF_8));
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Retrieves the license from the license file
     *
     * @param licenseFilePath The path to the license file
     * @return The license object represented as a {@link License}
     */
    public License retrieveLicenseFromFile(String licenseFilePath) {
        return retrieveLicenseFromFile(new File(licenseFilePath));
    }

}
