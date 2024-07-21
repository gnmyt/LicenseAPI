package de.licenseapi;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import de.licenseapi.entities.License;
import de.licenseapi.entities.LicenseMeta;
import de.licenseapi.entities.LicenseStatus;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;

public class LicenseValidator {

    private final int API_VERSION = 1;
    private final String baseUrl;
    private final String validationKey;

    private int retries = 3;

    /**
     * Creates a new {@link LicenseValidator} with the given validation key.
     *
     * @param baseUrl The base url of your LicenseAPI server (e.g. https://your-server.de)
     * @param validationKey The validation key of your project. You can find it in the project
     *                      settings.
     */
    public LicenseValidator(String baseUrl, String validationKey) {
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

            HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("User-Agent", "LicenseAPI-Java-Client");
            connection.setRequestProperty("X-Validation-Key", validationKey);

            if (connection.getResponseCode() != 200) return null;

            StringBuilder response = new StringBuilder();

            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            for (String line; (line = reader.readLine()) != null; ) {
                response.append(line);
            }

            return response.toString();
        } catch (Exception e) {
            return null;
        }
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
     * Parses the license object from the response
     *
     * @param status  the status of the license
     * @param license the license object
     * @return the parsed license object
     */
    private License parseLicense(LicenseStatus status, JsonObject license) {
        if (status != LicenseStatus.VALID) return new License(status, null, null, null, null, -1, 0, null);

        String licenseKey = license.get("key").getAsString();

        JsonArray groups = license.getAsJsonArray("groups");
        ArrayList<String> groupList = new ArrayList<>();
        for (int i = 0; i < groups.size(); i++) groupList.add(groups.get(i).getAsString());

        JsonArray permissions = license.getAsJsonArray("permissions");
        ArrayList<String> permissionList = new ArrayList<>();
        for (int i = 0; i < permissions.size(); i++) permissionList.add(permissions.get(i).getAsString());

        JsonObject meta = license.getAsJsonObject("meta");
        ArrayList<LicenseMeta> metaList = new ArrayList<>();
        for (String key : meta.keySet()) metaList.add(new LicenseMeta(key, meta.get(key).getAsString()));

        int maxUses = license.get("maxUses").getAsInt();
        int currentUses = license.get("currentUses").getAsInt();
        Instant instant = Instant.from(DateTimeFormatter.ISO_INSTANT.parse(license.get("expirationDate").getAsString()));

        return new License(status, licenseKey, groupList, permissionList, metaList, maxUses, currentUses,
                Date.from(instant).getTime() == 0 ? null : Date.from(instant));
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
        String status = object.get("status").getAsString();
        if (status.equals("INVALID_KEY")) return null;

        return parseLicense(LicenseStatus.valueOf(status), object.getAsJsonObject("license"));
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
