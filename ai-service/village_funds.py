import pandas as pd
import os

def get_village_funds_data(village, year, sub_village=None):
    # Construct filename
    filename = f"{village}_budget_allocation{year}.csv"
    filepath = os.path.join(os.path.dirname(__file__), '..', 'dataset', filename)
    
    if not os.path.exists(filepath):
        return {"error": "Data not found for the selected village and year"}
    
    # Read CSV
    df = pd.read_csv(filepath)
    
    # Clean data: remove rows with all NaN or empty
    df = df.dropna(how='all')
    df = df[df['Village Panchayat & Equivalent'].notna()]
    
    # Parse amounts: remove commas and convert to float
    def parse_amount(x):
        if pd.isna(x):
            return 0.0
        return float(str(x).replace(',', '').replace('.00', ''))
    
    df['Receipts'] = df['Receipts'].apply(parse_amount)
    df['Payments'] = df['Payments'].apply(parse_amount)
    
    # Filter by sub_village if provided
    if sub_village and sub_village != 'all':
        df = df[df['Village Panchayat & Equivalent'] == sub_village]
        if df.empty:
            return {"error": "Sub-village not found"}
    
    # Calculate totals
    total_receipts = df['Receipts'].sum()
    total_payments = df['Payments'].sum()
    
    # For bar chart: list of sub-villages
    bar_data = []
    for _, row in df.iterrows():
        bar_data.append({
            'sub_village': row['Village Panchayat & Equivalent'],
            'allocated': row['Receipts'],
            'used': row['Payments']
        })
    
    # For pie chart: total receipts vs payments
    pie_data = [
        {'name': 'Funds Allocated', 'value': total_receipts},
        {'name': 'Funds Used', 'value': total_payments}
    ]
    
    return {
        'bar_data': bar_data,
        'pie_data': pie_data,
        'total_allocated': total_receipts,
        'total_used': total_payments
    }