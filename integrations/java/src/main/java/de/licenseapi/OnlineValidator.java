package de.licenseapi;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import de.licenseapi.entities.License;
import de.licenseapi.entities.LicenseStatus;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Instant;

public class OnlineValidator extends LicenseValidator {

    private final int API_VERSION = 1;
    private final String baseUrl;
    private final String validationKey;

    private String publicKey;

    private int retries = 3;

    /**
     * Creates a new {@link OnlineValidator} with the given validation key.
     *
     * @param baseUrl The base url of your LicenseAPI server (e.g. https://your-server.de)
     * @param validationKey The validation key of your project. You can find it in the project
     *                      settings.
     */
    public OnlineValidator(String baseUrl, String validationKey) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.validationKey = validationKey;
    }

    /**
     * Retrieves the license from the license key. This method will return the raw response from the server.
     *
     * @param licenseKey The license key you want to validate
     * @return the raw response from the server or {@code null} if the validation key is invalid.
     */
    private String retrieveLicenseRaw(String licenseKey) {
        try {
            String url = String.format("%s/api/v%s/validate/%s", baseUrl, API_VERSION, URLDecoder.decode(licenseKey, "UTF-8"));
            if (publicKey != null) url += "/sign";

            return requestHTTP(url);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Retrieves the license file from the license key.
     * @param licenseKey The license key you want to validate
     * @return the license file or {@code null} if the validation key is invalid.
     */
    public String retrieveLicenseFile(String licenseKey) {
        try {
            String url = String.format("%s/api/v%s/validate/%s/offline", baseUrl, API_VERSION, URLDecoder.decode(licenseKey, "UTF-8"));

            return requestHTTP(url);
        } catch (Exception e) {
            return null;
        }
    }

    public void saveLicenseToFile(String licenseKey, File file) {
        String license = retrieveLicenseFile(licenseKey);
        if (license == null) return;

        try {
            Files.write(Paths.get(file.toURI()), license.getBytes(StandardCharsets.UTF_8));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Sends an HTTP GET request to the given URL.
     * @param url The URL you want to send the request to
     * @return The response from the server
     * @throws IOException If the request fails
     */
    private String requestHTTP(String url) throws IOException {
        HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
        connection.setRequestMethod("GET");
        connection.setRequestProperty("User-Agent", "LicenseAPI-Java-Client");
        connection.setRequestProperty("X-Validation-Key", validationKey);

        if (connection.getResponseCode() != 200) return null;

        StringBuilder response = new StringBuilder();

        BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        for (String line; (line = reader.readLine()) != null; ) {
            response.append(line).append("\n");
        }

        return response.toString();
    }

    /**
     * Retrieves the license from the license key. This method will return the raw response from the server.
     * <p>
     * This method will retry the request if the response is {@code null}.
     * The amount of retries can be set with {@link #setRetries(int)}.
     * If the amount of retries is 0, the license will be validated once.
     * The default amount of retries is 3.
     * <br><br>
     * <b>NOTE:</b> This method will wait 1 second between each retry.
     * </p>
     *
     * @param licenseKey The license key you want to validate
     * @return the raw response from the server or {@code null} if the validation key is invalid.
     */
    private String retrieveLicenseSecure(String licenseKey) {
        String response = retrieveLicenseRaw(licenseKey);
        if (response == null) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            int currentRetries = 0;
            while (currentRetries < retries) {
                response = retrieveLicenseRaw(licenseKey);
                if (response != null) break;
                currentRetries++;
            }
        }

        return response;
    }


    /**
     * Retrieves the license from the license key.
     *
     * @param licenseKey The license key you want to validate
     * @return a {@link License} object with the license information or {@code null} if the validation key is invalid.
     */
    public License retrieveLicense(String licenseKey) {
        String response = retrieveLicenseSecure(licenseKey);
        if (response == null) return null;

        JsonObject object = JsonParser.parseString(response).getAsJsonObject();

        if (publicKey != null) {
            String signature = object.get("signature").getAsString();
            JsonObject data = object.getAsJsonObject("object");

            try {
                if (!verifyLicense(keyFromString(this.publicKey), signature, data.toString())) {
                    return new License(LicenseStatus.INVALID_SIGNATURE, null, null, null, null, 0, null);
                }

                if (Instant.now().getEpochSecond() - data.get("timestamp").getAsLong() > 60) {
                    return new License(LicenseStatus.EXPIRED, null, null, null, null, 0, null);
                }

                if (data.get("timestamp").getAsLong() - Instant.now().getEpochSecond() > 60) {
                    return new License(LicenseStatus.EXPIRED, null, null, null, null, 0, null);
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
     * Gets the current amount of retries. If the amount of retries is 0, the license will be validated once.
     *
     * @param retries the new amount of retries
     */
    public void setRetries(int retries) {
        this.retries = retries;
    }

    /**
     * Sets the public key for the signature verification.
     */
    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    /**
     * Gets the current amount of retries. If the amount of retries is 0, the license will be validated once.
     *
     * @return the current amount of retries
     */
    public int getRetries() {
        return retries;
    }

    /**
     * Gets the current validation key
     *
     * @return the current validation key
     */
    public String getValidationKey() {
        return validationKey;
    }
}
