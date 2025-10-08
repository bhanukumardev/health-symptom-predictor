# Security Guidelines

## Admin Credentials

For security reasons, the default admin credentials have been removed from documentation files.

### For Development:
1. Check the backend logs when running `python backend/create_admin.py`
2. Use environment variables in `.env` file:
   ```bash
   ADMIN_EMAIL=your-admin@example.com
   ADMIN_PASSWORD=your-secure-password
   ```

### For Production:
1. Always use strong, unique passwords
2. Set credentials via environment variables
3. Never commit credentials to version control
4. Rotate passwords regularly

### Creating Admin Account:
Run the admin creation script:
```bash
cd backend
python create_admin.py
```

### Environment Variables:
Copy `.env.example` to `.env` and update with your credentials:
```bash
cp .env.example .env
# Edit .env with your actual credentials
```

## Testing
All test scripts now use environment variables for credentials. Set these before running tests:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Contact
For support, please create an issue on the GitHub repository.