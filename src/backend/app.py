from flask import Flask, request, jsonify ,send_from_directory
from flask_pymongo import PyMongo
import os
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from different origins

# MongoDB setup
app.config["MONGO_URI"] = "mongodb://localhost:27017/mydatabase"
mongo = PyMongo(app)

# Image upload folder setup
UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Helper function to check file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Create upload folder if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Route to add a new record (societe)
@app.route('/add-record', methods=['POST'])
def add_record():
    # Check if the post request has the file part
    if 'carteImage' not in request.files:
        return jsonify({"status": "No image file part"})

    file = request.files['carteImage']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
    else:
        filepath = None

    # Getting other form data
    import_products = request.form.get("importProducts", "").split(",")  # Split by commas for import products
    export_products = request.form.get("exportProducts", "").split(",")  # Split by commas for export products

    form_data = {
        "societeName": request.form.get("societeName"),
        "directorName": request.form.get("directorName"),
        "departement": request.form.get("departement"),
        "importProducts": [product.strip() for product in import_products],  # Store as list of strings
        "exportProducts": [product.strip() for product in export_products],  # Store as list of strings
        "number": request.form.get("number"),
        "email": request.form.get("email"),
        "website": request.form.get("website"),
        "pays": request.form.get("pays"),  # Country field
        "carteImage": filepath,  # Store file path or URL
    }

    try:
        # Insert into MongoDB
        result = mongo.db.societes.insert_one(form_data)
        return jsonify({"status": "Record added successfully", "id": str(result.inserted_id)})
    except Exception as e:
        return jsonify({"status": "Error adding record", "error": str(e)})

@app.route('/get-companies', methods=['GET'])
def get_companies():
    search_query = request.args.get('search', '').lower()  # Get the search query from URL parameters
    query_parts = search_query.split(',')  # Split query into parts for multi-condition search

    filter_query = {}

    # Initialize $or list for multiple fields to match
    or_conditions = []

    for part in query_parts:
        part = part.strip()

        if part:  # Only search if part is non-empty
            # Add condition for company name
            or_conditions.append({"societeName": {"$regex": part, "$options": "i"}})
            # Add condition for director name
            or_conditions.append({"directorName": {"$regex": part, "$options": "i"}})
            # Add condition for matching in importProducts array using $elemMatch
            or_conditions.append({"importProducts": {"$elemMatch": {"$regex": part, "$options": "i"}}})
            # Add condition for matching in exportProducts array using $elemMatch
            or_conditions.append({"exportProducts": {"$elemMatch": {"$regex": part, "$options": "i"}}})

    if or_conditions:
        filter_query["$or"] = or_conditions  # Apply $or if conditions exist

    companies = mongo.db.societes.find(filter_query)

    result = []
    for company in companies:
        company_data = {
            "societeName": company.get("societeName"),
            "directorName": company.get("directorName"),
            "departement": company.get("departement"),
            "importProducts": company.get("importProducts", []),
            "exportProducts": company.get("exportProducts", []),
            "number": company.get("number"),
            "email": company.get("email"),
            "website": company.get("website"),
            "pays": company.get("pays"),
            "carteImage": company.get("carteImage")
        }
        result.append(company_data)

    return jsonify(result)

@app.route('/uploads/<filename>')
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True , port=5000)
