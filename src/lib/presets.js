export const presets = [
  {
    name: 'Score Bar',
    type: 'score_bar',
    initialData: {
      name: 'Score Bar',
      props: {
        team1Name: 'Team A',
        team2Name: 'Team B',
        team1Score: 0,
        team2Score: 0,
        team1Logo: '',
        team2Logo: '',
        backgroundColor: 'rgba(29, 38, 51, 0.8)',
        textColor: '#ffffff',
      },
      html: `
        <div class="scoreboard">
          <div class="team">
            <img :src="props.team1Logo" class="logo" v-if="props.team1Logo" />
            <span class="name">{{ props.team1Name }}</span>
            <span class="score">{{ props.team1Score }}</span>
          </div>
          <div class="separator">-</div>
          <div class="team">
            <span class="score">{{ props.team2Score }}</span>
            <span class="name">{{ props.team2Name }}</span>
            <img :src="props.team2Logo" class="logo" v-if="props.team2Logo" />
          </div>
        </div>
      `,
      css: `
        .scoreboard {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Arial', sans-serif;
          color: white;
          background-color: rgba(29, 38, 51, 0.8);
          border-radius: 10px;
          padding: 10px 20px;
          font-size: 24px;
        }
        .team {
          display: flex;
          align-items: center;
        }
        .name {
          font-weight: bold;
          margin: 0 15px;
        }
        .score {
          background-color: rgba(0, 0, 0, 0.2);
          padding: 5px 15px;
          border-radius: 5px;
          font-weight: bold;
        }
        .separator {
          margin: 0 15px;
          font-weight: bold;
        }
        .logo {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }
      `,
      js: null,
      positionX: 560,
      positionY: 20,
      container: [800, 60],
    },
  },
  {
    name: 'Sponsor Carousel',
    type: 'sponsor_carousel',
    initialData: {
      name: 'Sponsors',
      props: {
        sponsors: [
          'https://via.placeholder.com/150/FF0000/FFFFFF?text=Sponsor+1',
          'https://via.placeholder.com/150/00FF00/FFFFFF?text=Sponsor+2',
          'https://via.placeholder.com/150/0000FF/FFFFFF?text=Sponsor+3',
        ],
        duration: 3000, // ms
      },
      html: `
        <div class="sponsor-carousel">
          <img id="sponsor-img" src="" alt="Sponsor" />
        </div>
      `,
      css: `
        .sponsor-carousel {
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        #sponsor-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }
        #sponsor-img.visible {
          opacity: 1;
        }
      `,
      js: `
        let currentIndex = 0;
        const sponsors = window.overlayProps.sponsors;
        const duration = window.overlayProps.duration || 3000;
        const imgElement = document.getElementById('sponsor-img');

        function showNextSponsor() {
          if (!sponsors || sponsors.length === 0) return;

          imgElement.classList.remove('visible');

          setTimeout(() => {
            currentIndex = (currentIndex + 1) % sponsors.length;
            imgElement.src = sponsors[currentIndex];
            imgElement.classList.add('visible');
          }, 500); // Wait for fade out
        }

        if (sponsors && sponsors.length > 0) {
            imgElement.src = sponsors[0];
            imgElement.classList.add('visible');
            setInterval(showNextSponsor, duration);
        }
      `,
      positionX: 810,
      positionY: 950,
      container: [300, 80],
    },
  },
];
