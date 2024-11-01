use rand::Rng;
use regex::Regex;

/// Regular expression pattern to validate if a string is a valid UUID (version 4).
/// A UUID is a 128-bit number used to uniquely identify information.
/// This pattern checks for the format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
fn is_valid_uuid(value: &str) -> bool {
    let uuid_pattern =
        Regex::new(r"^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")
            .expect("Failed to compile regex pattern");
    uuid_pattern.is_match(value)
}

/// Generates a UUID (version 4) in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
///
/// - This function uses cryptographically strong random values where available.
/// - Sets the version to 4 and the variant to RFC4122 for UUIDs.
///
/// Returns a valid UUID string.
fn generate_uuid() -> String {
    // Create an array to hold 16 random bytes (128 bits)
    let mut random_bytes = [0u8; 16];
    let mut rng = rand::thread_rng();

    // Fill `random_bytes` with random values
    rng.fill(&mut random_bytes);

    // Set version and variant bits
    random_bytes[6] = (random_bytes[6] & 0x0f) | 0x40; // Set version to 4
    random_bytes[8] = (random_bytes[8] & 0x3f) | 0x80; // Set variant to RFC4122

    // Convert bytes to UUID string format
    format!(
        "{:02x}{:02x}{:02x}{:02x}-{:02x}{:02x}-{:02x}{:02x}-{:02x}{:02x}-{:02x}{:02x}{:02x}{:02x}{:02x}{:02x}",
        random_bytes[0], random_bytes[1], random_bytes[2], random_bytes[3],
        random_bytes[4], random_bytes[5],
        random_bytes[6], random_bytes[7],
        random_bytes[8], random_bytes[9],
        random_bytes[10], random_bytes[11], random_bytes[12], random_bytes[13], random_bytes[14], random_bytes[15]
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_uuid_format() {
        let uuid = generate_uuid();
        // Check if the generated UUID is in the correct format
        assert!(
            is_valid_uuid(&uuid),
            "Generated UUID is not in a valid format"
        );
    }

    #[test]
    fn test_is_valid_uuid_valid_uuid() {
        // A sample valid UUID
        let valid_uuid = "123e4567-e89b-12d3-a456-426614174000";
        assert!(is_valid_uuid(valid_uuid), "Expected valid UUID to pass");
    }

    #[test]
    fn test_is_valid_uuid_invalid_uuid_wrong_format() {
        // Invalid UUID (wrong format)
        let invalid_uuid = "12345678-1234-1234-1234-1234567890";
        assert!(
            !is_valid_uuid(invalid_uuid),
            "Expected invalid UUID to fail"
        );
    }

    #[test]
    fn test_is_valid_uuid_invalid_uuid_wrong_version() {
        // Invalid UUID (version other than 4)
        let invalid_uuid = "123e4567-e89b-12d3-b456-426614174000"; // Wrong version bits
        assert!(
            !is_valid_uuid(invalid_uuid),
            "Expected invalid UUID to fail due to wrong version"
        );
    }

    #[test]
    fn test_is_valid_uuid_empty_string() {
        // Empty string should fail validation
        let empty_string = "";
        assert!(
            !is_valid_uuid(empty_string),
            "Expected empty string to be invalid UUID"
        );
    }

    #[test]
    fn test_is_valid_uuid_random_strings() {
        // Random strings that are not UUIDs
        let random_strings = vec![
            "not-a-uuid",
            "12345678",
            "abcdefgh-ijkl-mnop-qrst-uvwxyzabcdef",
            "123e4567e89b12d3a456426614174000", // Missing hyphens
        ];

        for random_string in random_strings {
            assert!(
                !is_valid_uuid(random_string),
                "Expected random string '{}' to be invalid UUID",
                random_string
            );
        }
    }

    #[test]
    fn test_generate_multiple_uuids_unique() {
        // Generate multiple UUIDs and ensure they are unique
        let uuid1 = generate_uuid();
        let uuid2 = generate_uuid();
        assert_ne!(uuid1, uuid2, "Expected generated UUIDs to be unique");
    }
}
