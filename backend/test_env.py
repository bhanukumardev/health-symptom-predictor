from pydantic_settings import BaseSettings, SettingsConfigDict

class TestSettings(BaseSettings):
    GROQ_API_KEY: str = ""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"  # Ignore extra environment variables
    )

if __name__ == "__main__":
    settings = TestSettings()
    print(f"✅ GROQ_API_KEY loaded: {bool(settings.GROQ_API_KEY)}")
    if settings.GROQ_API_KEY:
        print(f"✅ Key starts with: {settings.GROQ_API_KEY[:20]}...")
    else:
        print("❌ Key is empty!")
