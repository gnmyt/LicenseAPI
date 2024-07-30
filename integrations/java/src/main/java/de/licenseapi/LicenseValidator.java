package de.licenseapi;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import de.licenseapi.entities.License;
import de.licenseapi.entities.LicenseMeta;
import de.licenseapi.entities.LicenseStatus;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;

public abstract class LicenseValidator {

    /**
     * Parses the license object from the response
     *
     * @param license the license object
     * @return the parsed license object
     */
    protected License parseLicense(JsonObject license) {
        LicenseStatus status = LicenseStatus.valueOf(license.get("status").getAsString());
        if (status != LicenseStatus.VALID) return new License(status, null, null, null, null, 0, null);

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

        int currentUses = license.get("currentUses").getAsInt();
        Instant instant = Instant.from(DateTimeFormatter.ISO_INSTANT.parse(license.get("expirationDate").getAsString()));

        if (Instant.now().isAfter(instant) && instant.getEpochSecond() != 0)
            status = LicenseStatus.EXPIRED;

        return new License(status, licenseKey, groupList, permissionList, metaList, currentUses,
                Date.from(instant).getTime() == 0 ? null : Date.from(instant));
    }

    /**
     * Reads a public key from a string
     * @param key The public key as a string
     * @return The public key
     * @throws Exception If the key is invalid
     */
    public static PublicKey keyFromString(String key) throws Exception {
        String cleanKey = key.replaceAll("-----BEGIN PUBLIC KEY-----", "")
                .replaceAll("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");

        byte[] keyBytes = Base64.getDecoder().decode(cleanKey);

        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePublic(spec);
    }

    /**
     * Verifies a license
     * @param publicKey The public key
     * @param signature The signature
     * @param data The data
     * @return If the license is valid
     * @throws Exception If the license is invalid
     */
    protected boolean verifyLicense(PublicKey publicKey, String signature, String data) throws Exception {
        Signature sig = Signature.getInstance("SHA256withRSA");
        sig.initVerify(publicKey);
        sig.update(data.getBytes(StandardCharsets.UTF_8));
        return sig.verify(hexStringToByteArray(signature));
    }

    /**
     * Converts a hex string to a byte array
     * @param s The hex string
     * @return The byte array
     */
    protected byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4) + Character.digit(s.charAt(i+1), 16));
        }
        return data;
    }

}
