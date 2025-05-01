import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.neighbors import KNeighborsClassifier

# Load dataset
file_path = "c:\\Users\\abina\\OneDrive\\Desktop\\foooddata.xlsx"
xls = pd.ExcelFile(file_path)
df = pd.read_excel(xls, sheet_name='1_Table 1. PROXIMATE PRINCIPL')

# Function to clean numeric values
def clean_numeric(value):
    if isinstance(value, str) and '±' in value:
        return float(value.split('±')[0])
    try:
        return float(value)
    except ValueError:
        return np.nan

# Select relevant features
nutrient_columns = ['ENERC', 'PROTCNT', 'CHOAVLDF', 'FATCE', 'FIBTG', 'ASH', 'FIBINS']
df[nutrient_columns] = df[nutrient_columns].map(clean_numeric)
df = df.dropna(subset=['Food name'])
df.reset_index(drop=True, inplace=True)

# Prepare data for training
X = df[nutrient_columns]
y = df['Food name']

# Handle missing values
imputer = SimpleImputer(strategy='median')
X_imputed = imputer.fit_transform(X)

# Normalize data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_imputed)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train KNN model
knn_model = KNeighborsClassifier(n_neighbors=5)
knn_model.fit(X_train, y_train)

# Save everything in one file
model_data = {
    "model": knn_model,
    "scaler": scaler,
    "imputer": imputer
}
joblib.dump(model_data, 'nutrienguide_model.pkl')

# Function to recommend food based on user inputs
def recommend_food(calories, protein, carbs, fats, iron, calcium, fiber):
    user_input = pd.DataFrame([[calories, protein, carbs, fats, iron, calcium, fiber]], 
                               columns=['ENERC', 'PROTCNT', 'CHOAVLDF', 'FATCE', 'FIBTG', 'ASH', 'FIBINS'])
    user_input_scaled = scaler.transform(imputer.transform(user_input))
    recommended_foods = knn_model.kneighbors(user_input_scaled, n_neighbors=5, return_distance=False)
    return y.iloc[recommended_foods[0]].values

# Example test
print(recommend_food(200, 10, 30, 5, 15, 900, 20))