// Function to fetch data from the API
export async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Function to create data in the API
export async function createData(url, newData) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating data:', error);
        throw error;
    }
}

// Function to update data in the API
export async function updateData(url, updatedData) {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
}

// Function to delete data from the API
export async function deleteData(url) {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
}

export class JSONServer {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async get(resource) {
        const url = `${this.baseUrl}/${resource}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    async post(resource, newData) {
        const url = `${this.baseUrl}/${resource}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating data:', error);
            throw error;
        }
    }

    async put(resource, itemId, updatedData) {
        const url = `${this.baseUrl}/${resource}/${itemId}`;
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating data:', error);
            throw error;
        }
    }

    async delete(resource, itemId) {
        const url = `${this.baseUrl}/${resource}/${itemId}`;
        try {
            const response = await fetch(url, {
                method: 'DELETE',
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting data:', error);
            throw error;
        }
    }
}