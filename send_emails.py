import os
import time
import pandas as pd
import yagmail
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SENDER = os.getenv('SEND_EMAIL_FROM')
APP_PASSWORD = os.getenv('APP_PASSWORD')
DELAY_SECONDS = int(os.getenv('DELAY_SECONDS') or 60)
PUBLIC_APP_URL = os.getenv('PUBLIC_APP_URL') or 'http://localhost:3000'

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

if not all([SENDER, APP_PASSWORD, SUPABASE_URL, SUPABASE_KEY]):
    print('Please set SEND_EMAIL_FROM, APP_PASSWORD, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY in .env')
    raise SystemExit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def send_batch(csv_path='leads.csv'):
    yag = yagmail.SMTP(SENDER, APP_PASSWORD)
    leads = pd.read_csv(csv_path)

    for _, row in leads.iterrows():
        to = row['email']
        name = row.get('name') or row.get('business_name') or ''
        location = row.get('location') or ''

        # pixel URL — records opens
        pixel = f"{PUBLIC_APP_URL}/api/track?email={to}"

        body = f"""
Hello {name},

My name is Peter, a web developer based near {location}.

I build modern, mobile-friendly websites that help local businesses get more customers.

If you'd like a free website audit, reply to this email or book a 15-min consult: {PUBLIC_APP_URL}

If you'd prefer not to hear from me again, reply "UNSUBSCRIBE".

Best,
Peter
Web Developer

<img src=\"{pixel}\" width=1 height=1 />
"""

        print('Sending to', to)
        try:
            yag.send(to=to, subject='Free website audit — I can help', contents=body)

            # record event in Supabase: mark last_contacted
            supabase.table('leads').upsert({'email': to, 'business_name': name, 'location': location, 'last_contacted': 'now()'}).execute()

        except Exception as e:
            print('Error sending to', to, e)

        time.sleep(DELAY_SECONDS)

if __name__ == '__main__':
    send_batch()
