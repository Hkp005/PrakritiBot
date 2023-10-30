import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import pickle

# Load the csv file
df = pd.read_csv("Prakriti.csv")

# Select independent and dependent variable
X = df[
    ["Visual_features", "Tactile_features", "Joints", "Eyes", "Nails", "Teeth", "Mouth", 
    "Palm_and_Sole", "Hair", "Voice_assessment", "Sleep_pattern", "Movement_and_Gait", 
    "Diet_and_Lifestyle", "Excretory_products"]
]
y = df["Prakriti"]

# Encode class labels to integers
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y)

# Define columns to be one-hot encoded
categorical_features = [
    "Visual_features", "Tactile_features", "Joints", "Eyes", "Nails", "Teeth", "Mouth", 
    "Palm_and_Sole", "Hair", "Voice_assessment", "Sleep_pattern", "Movement_and_Gait", 
    "Diet_and_Lifestyle", "Excretory_products"
]

# Create a ColumnTransformer to apply one-hot encoding
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(), categorical_features)
    ],
    remainder='passthrough'  # Include non-categorical columns as-is
)

# Create an XGBoost model
model = XGBClassifier()

# Create a pipeline that first applies preprocessing and then fits the model
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', model)
])

# Split the dataset into train and test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Fit the pipeline (preprocessing + model)
pipeline.fit(X_train, y_train)

# # Save the label encoder for later use
with open("label_encoder.pkl", "wb") as le_file:
    pickle.dump(label_encoder, le_file)

# Save the model (including preprocessing)
with open("model.pkl", "wb") as model_file:
    pickle.dump(pipeline, model_file)
# Save the column names to a text file    
with open("column_names.txt", "w") as f:
    f.write("\n".join(X.columns))