export async function getCoordinatesFromAddress(address: string): Promise<[number, number] | null> {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyBKthUEQewpbJT6jHHl3zzkJlyZzbOdudI`);
        const data = await response.json();

        if (data.results[0]) {
            const location = data.results[0].geometry.location;
            return [location.lat, location.lng];
        }
        return null;
    } catch (error) {
        console.error("Erro ao buscar coordenadas:", error);
        return null;
    }
}