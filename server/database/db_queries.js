const dbConnection = require('./db_connection.js');

data = {};

data.getJobs = (callback, term) => {
    if (!term) {
        dbConnection.query(
            `SELECT * FROM jobs 
                WHERE end_date < NOW()
                ORDER BY start_date 
                LIMIT 10;`,
            (err, res) => {
                if (err) {
                    callback(err);
                }
                callback(null, res.rows);
            }
        );
    } else {
        dbConnection.query(
            `SELECT * FROM jobs 
                WHERE CATEGORY = $1 
                AND end_date < NOW() 
                ORDER BY start_date;`,
            [term],
            (err, res) => {
                if (err) {
                    callback(err);
                }
                callback(null, res.rows);
            }
        );
    }
};

data.getRandomJobs = callback => {};

data.getStudents = (term, callback) => {
    dbConnection.query(
        `SELECT * FROM students 
            WHERE CATEGORY = $1`,
        [term],
        (err, res) => {
            if (err) {
                callback(err);
            }
            callback(null, res.rows);
        }
    );
};

data.loginRequest = (email, callback) => {
    dbConnection.query(
        `SELECT residents.email, residents.password, 'Resident' AS group
            FROM residents
            WHERE residents.email = $1
            UNION ALL
            SELECT students.email, students.password, 'Student' AS group
                FROM students
                WHERE students.email = $1;`,
        [email],
        (err, res) => {
            if (err) {
                callback(err);
            }
            callback(null, res.rows[0]);
        }
    );
};

data.studentExists = (email, callback) => {
    dbConnection.query(
        `SELECT exists(
            SELECT 1 FROM students
                WHERE email = $1);`,
        [email],
        (err, res) => {
            if (err) {
                callback(err);
            }
            callback(null, res.rows[0]);
        }       
    );
};
    
data.postStudents = (student, callback) => {
    dbConnection.query(
        `INSERT INTO students(
            first_name, last_name, email, DOB, univ_school, 
            bio, picture, phone, job_cat, password_hash)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        [
            student.first_name,
            student.last_name,
            student.email,
            student.DOB,
            student.univ_school,
            student.bio,
            student.picture,
            student.phone,
            student.job_cat,
            student.password_hash,
        ],
        (err, res) => {
            if (err) {
                callback(err,'general error');
            }
            callback(null, res.rows);
        }
    );
};


data.postResidents = (resident, callback) => {
    dbConnection.query(
        `INSERT INTO residents(
            first_name, last_name, email, DOB, 
            address, bio, picture, phone, password_hash) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        [
            resident.first_name,
            resident.last_name,
            resident.email,
            resident.DOB,
            resident.address,
            resident.bio,
            resident.picture,
            resident.phone,
            resident.password_hash,
        ],
        (err, res) => {
            if (err) {
                callback(err);
            }
            callback(null, res.rows);
        }
    );
};

data.postJobs = (jobsObject, callback) => {
    dbConnection.query(
        `INSERT INTO jobs(
        job_title, start_date, start_time, end_date, 
        end_time, description, rate, resident_id, category) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        [
            jobsObject.job_title,
            jobsObject.start_date,
            jobsObject.start_time,
            jobsObject.end_date,
            jobsObject.end_time,
            jobsObject.description,
            jobsObject.rate,
            jobsObject.resident_id,
            jobsObject.category
        ],
        (err, res) => {
            if (err) {
                callback(err);
            }

            callback(null, res.rows);
        }
    );
};

module.exports = data;
