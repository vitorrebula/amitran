import styled from 'styled-components';

export const RegionMapContainer = styled.div`
    padding: 30px;

    .disabled {
        width: 100%;
        height: 100%;
        .leaflet-container.leaflet-touch.leaflet-fade-anim.leaflet-grab.leaflet-touch-drag.leaflet-touch-zoom {
            filter: grayscale(100%) brightness(40%);
            pointer-events: none;
            cursor: not-allowed !important;
        }
    }

    .leaflet-container.leaflet-touch.leaflet-fade-anim.leaflet-grab.leaflet-touch-drag.leaflet-touch-zoom {
        &.disabled {
            filter: grayscale(80%) brightness(50%);
        }
    }
    .leaflet-control-attribution.leaflet-control {
        display: none;
    }

    @media(max-width: 768px) {
        .ant-row {
            flex-direction: column;
        }
        .ant-col-12 {
            max-width: 100%;
        }
    }
`;