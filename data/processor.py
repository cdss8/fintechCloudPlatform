import pandas as pd
import numpy as np

import time

print("Simple data analys and visualization with py")

while True:
    # TransactionSlot simulation
    data_stat = pd.DataFrame({
        'transactionID': range(100),
        'amount': np.random.uniform(10, 1000, 100)
    })
    
    avg_amount =data_stat['amount'].mean()
    print(f"Average ammount of money of slot processed${avg_amount:.2f}")
    
    time.sleep(30)