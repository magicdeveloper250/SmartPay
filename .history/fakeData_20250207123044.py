import pandas as pd
import numpy as np
from faker import Faker
import random

# Initialize Faker for generating fake data
fake = Faker()
currencies=  [
"USD",
"EUR",
"JPY",
"AUD",
"CAD",
"CHF",
"CNY",
"HKD",
"NZD",
"SEK",
"KRW",
"SGD",
"NOK",
"MXN",
"INR",
"RUB",
"ZAR",
"BRL",
"AED",

]
   
    
 

# Generate sample data
num_employees = 10  # Number of employees to generate
data = {
    "firstName": [fake.first_name() for _ in range(num_employees)],
    "secondName": [fake.last_name() for _ in range(num_employees)],
    "email":[fake.unique.email() for _ in range(num_employees)],
    "phoneNumber":[fake.unique.phone_number() for _ in range(num_employees)],
    "currency":[random.choice(currencies) for _ in range(num_employees)],
    "address":[fake.address() for _ in range(num_employees)],
    "employeeID": [fake.unique.uuid4() for _ in range(num_employees)],
    "nationalID": [fake.unique.ssn() for _ in range(num_employees)],
    "startDate": [fake.date_between(start_date="-5y", end_date="today").strftime("%Y-%m-%d") for _ in range(num_employees)],
    "department": [fake.random_element(elements=("HR", "Finance", "Engineering", "Sales", "Marketing")) for _ in range(num_employees)],
    "jobTitle": [fake.job() for _ in range(num_employees)],
    "currency": [fake.currency_code() for _ in range(num_employees)],
    "monthlyGross": [str(round(np.random.uniform(3000, 10000), 2)) for _ in range(num_employees)],
    "bankName": [fake.random_element(elements=("Bank of America", "Chase", "Wells Fargo", "Citi", None)) for _ in range(num_employees)],
    "bankAccountNumber": [fake.unique.iban() for _ in range(num_employees)],
    "swiftCode": [fake.swift11()  for _ in range(num_employees)],
    "Domicile": [fake.country() for _ in range(num_employees)],
    "walletAddress": [fake.unique.uuid4() if np.random.rand() > 0.3 else None for _ in range(num_employees)],
    "companyId": [fake.unique.uuid4() for _ in range(num_employees)],
}

# Create DataFrame
df = pd.DataFrame(data)

# Export to Excel
df.to_excel("employee_data.xlsx", index=False)

print("Excel file 'employee_data.xlsx' generated successfully!")