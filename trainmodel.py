import json
import nltk
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import pickle

nltk.download('punkt')
with open('data.json', 'r') as f:
    data = json.load(f)

patterns = []
labels = []
responses = []

for intent in data['intents']:
    for pattern in intent['patterns']:
        patterns.append(pattern)
        labels.append(intent['intent'])
        responses.append(intent['responses'][0])

label_map = {label: idx for idx, label in enumerate(sorted(set(labels)))}
inv_label_map = {idx: label for label, idx in label_map.items()}
numeric_labels = [label_map[label] for label in labels]
X_train, X_test, y_train, y_test = train_test_split(
    patterns, numeric_labels, test_size=0.2, random_state=42
)
model = make_pipeline(TfidfVectorizer(), MultinomialNB())
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Test Accuracy: {accuracy:.2f}")

all_labels = list(label_map.values())
target_names = [label for label, _ in sorted(label_map.items(), key=lambda x: x[1])]
missing_labels = set(all_labels) - set(np.unique(y_test))
if missing_labels:
    print(f"\n Warning: The following labels are missing in the test set: "
          f"{[inv_label_map[i] for i in missing_labels]}")

print("\n Classification Report:\n")
print(classification_report(
    y_test, y_pred,
    labels=all_labels,
    target_names=target_names,
    zero_division=0
))
with open('intent_classifier.pkl', 'wb') as model_file:
    pickle.dump(model, model_file)

with open('label_map.pkl', 'wb') as label_file:
    pickle.dump(label_map, label_file)

print("\nModel and label map saved successfully")
