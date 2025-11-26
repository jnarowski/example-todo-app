<div class="robot-container" aria-hidden="true">
  <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" class="robot">
    <!-- Head -->
    <g class="head">
      <circle cx="100" cy="50" r="30" fill="#667eea" />
      <!-- Eyes -->
      <circle cx="90" cy="45" r="5" fill="white" />
      <circle cx="110" cy="45" r="5" fill="white" />
      <circle cx="90" cy="45" r="3" fill="#333" />
      <circle cx="110" cy="45" r="3" fill="#333" />
      <!-- Antenna -->
      <line x1="100" y1="20" x2="100" y2="10" stroke="#764ba2" stroke-width="3" />
      <circle cx="100" cy="8" r="5" fill="#764ba2" />
    </g>

    <!-- Body -->
    <g class="body">
      <rect x="70" y="85" width="60" height="80" rx="10" fill="#667eea" />
      <!-- Chest panel -->
      <rect x="80" y="95" width="40" height="30" rx="5" fill="#764ba2" />
      <!-- Buttons -->
      <circle cx="100" cy="140" r="4" fill="#ffd700" />
      <circle cx="100" cy="152" r="4" fill="#ffd700" />
    </g>

    <!-- Left Arm -->
    <g class="arm-left">
      <rect x="40" y="90" width="25" height="50" rx="8" fill="#667eea" />
      <circle cx="52.5" cy="145" r="8" fill="#764ba2" />
    </g>

    <!-- Right Arm -->
    <g class="arm-right">
      <rect x="135" y="90" width="25" height="50" rx="8" fill="#667eea" />
      <circle cx="147.5" cy="145" r="8" fill="#764ba2" />
    </g>

    <!-- Left Leg -->
    <g class="leg-left">
      <rect x="75" y="170" width="20" height="50" rx="5" fill="#667eea" />
      <rect x="72" y="220" width="26" height="15" rx="7" fill="#764ba2" />
    </g>

    <!-- Right Leg -->
    <g class="leg-right">
      <rect x="105" y="170" width="20" height="50" rx="5" fill="#667eea" />
      <rect x="102" y="220" width="26" height="15" rx="7" fill="#764ba2" />
    </g>
  </svg>
</div>

<style>
  .robot-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .robot {
    width: 150px;
    height: 225px;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  }

  /* Animation: Body Bounce */
  .body {
    animation: bounce 1.5s ease-in-out infinite;
    transform-origin: center;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  /* Animation: Head Bob */
  .head {
    animation: head-bob 1.5s ease-in-out infinite;
    transform-origin: center;
  }

  @keyframes head-bob {
    0%, 100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-5deg);
    }
    75% {
      transform: rotate(5deg);
    }
  }

  /* Animation: Left Arm Wave */
  .arm-left {
    animation: wave-left 2s ease-in-out infinite;
    transform-origin: 52.5px 90px;
  }

  @keyframes wave-left {
    0%, 100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-20deg);
    }
    75% {
      transform: rotate(15deg);
    }
  }

  /* Animation: Right Arm Wave */
  .arm-right {
    animation: wave-right 2s ease-in-out infinite 0.5s;
    transform-origin: 147.5px 90px;
  }

  @keyframes wave-right {
    0%, 100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(20deg);
    }
    75% {
      transform: rotate(-15deg);
    }
  }

  @media (max-width: 768px) {
    .robot {
      width: 120px;
      height: 180px;
    }
  }
</style>
