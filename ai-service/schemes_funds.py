import pandas as pd
import os

def get_schemes_funds_data(state=None, district=None, village=None, scheme=None, year=None, work_type=None):
    """
    Get schemes funds data with optional filtering
    """
    filepath = os.path.join(os.path.dirname(__file__), '..', 'dataset2', 'up_large_dataset.csv')

    if not os.path.exists(filepath):
        return {"error": "Schemes data file not found"}

    # Read CSV
    df = pd.read_csv(filepath)

    # Clean data
    df = df.dropna(how='all')

    # Parse amounts
    def parse_amount(x):
        if pd.isna(x):
            return 0.0
        return float(str(x).replace(',', '').replace('.00', ''))

    df['allocated_fund'] = df['allocated_fund'].apply(parse_amount)
    df['used_fund'] = df['used_fund'].apply(parse_amount)

    # Apply filters
    if state and state != 'all':
        df = df[df['state'] == state]
    if district and district != 'all':
        df = df[df['district'] == district]
    if village and village != 'all':
        df = df[df['village'] == village]
    if scheme and scheme != 'all':
        df = df[df['scheme'] == scheme]
    if year and year != 'all':
        df = df[df['year'] == year]
    if work_type and work_type != 'all':
        df = df[df['work_type'] == work_type]

    if df.empty:
        return {"error": "No data found for the selected filters"}

    # Calculate totals
    total_allocated = df['allocated_fund'].sum()
    total_used = df['used_fund'].sum()

    # For bar chart: group by scheme
    scheme_data = df.groupby('scheme').agg({
        'allocated_fund': 'sum',
        'used_fund': 'sum'
    }).reset_index()

    bar_data = []
    for _, row in scheme_data.iterrows():
        bar_data.append({
            'scheme': row['scheme'],
            'allocated': row['allocated_fund'],
            'used': row['used_fund']
        })

    # For pie chart: total allocated vs used
    pie_data = [
        {'name': 'Funds Allocated', 'value': total_allocated},
        {'name': 'Funds Used', 'value': total_used}
    ]

    return {
        'bar_data': bar_data,
        'pie_data': pie_data,
        'total_allocated': total_allocated,
        'total_used': total_used,
        'record_count': len(df)
    }