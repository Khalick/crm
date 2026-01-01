import csv
import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY in .env')
    raise SystemExit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def import_csv(path='leads.csv'):
    with open(path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        rows = []
        for r in reader:
            rows.append({
                'business_name': r.get('name'),
                'email': r.get('email'),
                'location': r.get('location')
            })

        if not rows:
            print('No rows to insert')
            return

        res = supabase.table('leads').insert(rows).execute()
        print('Insert result:', res)

if __name__ == '__main__':
    import_csv()
