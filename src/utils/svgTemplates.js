const svgTemplates = {
    dots: (accent, primary, secondary) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="420" height="500" viewBox="0 0 420 500" fill="none">
      <g clip-path="url(#clip0_7_45)">
        <rect class="Accent" width="420" height="500" fill="${accent}"/>
        <circle class="Secondary" opacity="0.1" cx="131.5" cy="263.5" r="59.5" fill="${secondary}"/>
        <circle class="Secondary" opacity="0.1" cx="304.5" cy="52.5" r="59.5" fill="${secondary}"/>
        <circle class="Secondary" opacity="0.1" cx="72.5" cy="432.5" r="59.5" fill="${secondary}"/>
        <circle class="Secondary" opacity="0.1" cx="29.5" cy="35.5" r="59.5" fill="${secondary}"/>
        <circle class="Secondary" opacity="0.1" cx="377.5" cy="349.5" r="59.5" fill="${secondary}"/>
        <circle class="Secondary" opacity="0.1" cx="245" cy="420" r="47" fill="${secondary}"/>
        <circle class="Secondary" opacity="0.1" cx="163" cy="125" r="47" fill="${secondary}"/>
        <circle class="Secondary" opacity="0.1" cx="304" cy="228" r="45" fill="${secondary}"/>
        <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M359 155C364.523 155 369 150.523 369 145C369 139.477 364.523 135 359 135C353.477 135 349 139.477 349 145C349 150.523 353.477 155 359 155ZM359 150C361.761 150 364 147.761 364 145C364 142.239 361.761 140 359 140C356.239 140 354 142.239 354 145C354 147.761 356.239 150 359 150Z" fill="${primary}"/>
        <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M220 228C225.523 228 230 223.523 230 218C230 212.477 225.523 208 220 208C214.477 208 210 212.477 210 218C210 223.523 214.477 228 220 228ZM220 223C222.761 223 225 220.761 225 218C225 215.239 222.761 213 220 213C217.239 213 215 215.239 215 218C215 220.761 217.239 223 220 223Z" fill="${primary}"/>
        <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M39 175C44.5228 175 49 170.523 49 165C49 159.477 44.5228 155 39 155C33.4772 155 29 159.477 29 165C29 170.523 33.4772 175 39 175ZM39 170C41.7614 170 44 167.761 44 165C44 162.239 41.7614 160 39 160C36.2386 160 34 162.239 34 165C34 167.761 36.2386 170 39 170Z" fill="${primary}"/>
      </g>
    </svg>`,
    Dots: (accent, primary, secondary) => `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="420"
        height="500"
        viewBox="0 0 420 500"
        fill="none"
      >
        <g clip-path="url(#clip0_13_2195)">
          <rect class="Accent" width="420" height="500" fill="${accent}" />
          <!-- <path
            class="Primary"
            d="M187.581 488C187.581 539.086 128.259 580.5 55.081 580.5C-18.0967 580.5 -77.419 539.086 -77.419 488C-77.419 436.914 -24.581 377 42.5 409C117 488 140 408.5 187.581 488Z"
            fill="${primary}"
          /> -->
          <path
            class="Primary"
            d="M515 32C515 65.1371 465 22.5 325 69C248.5 10 92 65.1371 92 32C92 -1.13708 186.692 -28 303.5 -28C420.308 -28 515 -1.13708 515 32Z"
            fill="${primary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M283 139C296.807 139 308 127.807 308 114C308 100.193 296.807 89 283 89C269.193 89 258 100.193 258 114C258 127.807 269.193 139 283 139ZM283 119C289.904 119 295.5 113.404 295.5 106.5C295.5 99.5964 289.904 94 283 94C276.096 94 270.5 99.5964 270.5 106.5C270.5 113.404 276.096 119 283 119Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M354.785 189.27C341.097 191.075 331.464 203.636 333.27 217.325C335.075 231.013 347.636 240.646 361.325 238.84C375.013 237.034 384.646 224.474 382.84 210.785C381.034 197.097 368.474 187.464 354.785 189.27ZM357.401 209.098C350.557 210.001 345.74 216.281 346.643 223.125C347.546 229.97 353.826 234.786 360.671 233.883C367.515 232.98 372.331 226.7 371.428 219.856C370.526 213.011 364.245 208.195 357.401 209.098Z"
            fill="${secondary}"
          />
          <path
            class="Primary"
            d="M515 289.5C515 331.198 484.779 365 447.5 365C410.221 365 380.5 463.5 380.5 344C394 234 410.221 214 447.5 214C484.779 214 515 247.803 515 289.5Z"
            fill="${primary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M25.5 99C24.1193 99 23 100.119 23 101.5C23 102.881 24.1193 104 25.5 104C26.8807 104 28 102.881 28 101.5C28 100.119 26.8807 99 25.5 99Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M35.5 99C34.1193 99 33 100.119 33 101.5C33 102.881 34.1193 104 35.5 104C36.8807 104 38 102.881 38 101.5C38 100.119 36.8807 99 35.5 99Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M45.5 99C44.1193 99 43 100.119 43 101.5C43 102.881 44.1193 104 45.5 104C46.8807 104 48 102.881 48 101.5C48 100.119 46.8807 99 45.5 99Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M55.5 99C54.1193 99 53 100.119 53 101.5C53 102.881 54.1193 104 55.5 104C56.8807 104 58 102.881 58 101.5C58 100.119 56.8807 99 55.5 99Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M65.5 99C64.1193 99 63 100.119 63 101.5C63 102.881 64.1193 104 65.5 104C66.8807 104 68 102.881 68 101.5C68 100.119 66.8807 99 65.5 99Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M75.5 99C74.1193 99 73 100.119 73 101.5C73 102.881 74.1193 104 75.5 104C76.8807 104 78 102.881 78 101.5C78 100.119 76.8807 99 75.5 99Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M85.5 99C84.1193 99 83 100.119 83 101.5C83 102.881 84.1193 104 85.5 104C86.8807 104 88 102.881 88 101.5C88 100.119 86.8807 99 85.5 99Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M25.5 89C24.1193 89 23 90.1193 23 91.5C23 92.8807 24.1193 94 25.5 94C26.8807 94 28 92.8807 28 91.5C28 90.1193 26.8807 89 25.5 89Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M35.5 89C34.1193 89 33 90.1193 33 91.5C33 92.8807 34.1193 94 35.5 94C36.8807 94 38 92.8807 38 91.5C38 90.1193 36.8807 89 35.5 89Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M45.5 89C44.1193 89 43 90.1193 43 91.5C43 92.8807 44.1193 94 45.5 94C46.8807 94 48 92.8807 48 91.5C48 90.1193 46.8807 89 45.5 89Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M55.5 89C54.1193 89 53 90.1193 53 91.5C53 92.8807 54.1193 94 55.5 94C56.8807 94 58 92.8807 58 91.5C58 90.1193 56.8807 89 55.5 89Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M65.5 89C64.1193 89 63 90.1193 63 91.5C63 92.8807 64.1193 94 65.5 94C66.8807 94 68 92.8807 68 91.5C68 90.1193 66.8807 89 65.5 89Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M75.5 89C74.1193 89 73 90.1193 73 91.5C73 92.8807 74.1193 94 75.5 94C76.8807 94 78 92.8807 78 91.5C78 90.1193 76.8807 89 75.5 89Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M85.5 89C84.1193 89 83 90.1193 83 91.5C83 92.8807 84.1193 94 85.5 94C86.8807 94 88 92.8807 88 91.5C88 90.1193 86.8807 89 85.5 89Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M25.5 79C24.1193 79 23 80.1193 23 81.5C23 82.8807 24.1193 84 25.5 84C26.8807 84 28 82.8807 28 81.5C28 80.1193 26.8807 79 25.5 79Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M35.5 79C34.1193 79 33 80.1193 33 81.5C33 82.8807 34.1193 84 35.5 84C36.8807 84 38 82.8807 38 81.5C38 80.1193 36.8807 79 35.5 79Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M45.5 79C44.1193 79 43 80.1193 43 81.5C43 82.8807 44.1193 84 45.5 84C46.8807 84 48 82.8807 48 81.5C48 80.1193 46.8807 79 45.5 79Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M55.5 79C54.1193 79 53 80.1193 53 81.5C53 82.8807 54.1193 84 55.5 84C56.8807 84 58 82.8807 58 81.5C58 80.1193 56.8807 79 55.5 79Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M65.5 79C64.1193 79 63 80.1193 63 81.5C63 82.8807 64.1193 84 65.5 84C66.8807 84 68 82.8807 68 81.5C68 80.1193 66.8807 79 65.5 79Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M75.5 79C74.1193 79 73 80.1193 73 81.5C73 82.8807 74.1193 84 75.5 84C76.8807 84 78 82.8807 78 81.5C78 80.1193 76.8807 79 75.5 79Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M85.5 79C84.1193 79 83 80.1193 83 81.5C83 82.8807 84.1193 84 85.5 84C86.8807 84 88 82.8807 88 81.5C88 80.1193 86.8807 79 85.5 79Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M25.5 69C24.1193 69 23 70.1193 23 71.5C23 72.8807 24.1193 74 25.5 74C26.8807 74 28 72.8807 28 71.5C28 70.1193 26.8807 69 25.5 69Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M35.5 69C34.1193 69 33 70.1193 33 71.5C33 72.8807 34.1193 74 35.5 74C36.8807 74 38 72.8807 38 71.5C38 70.1193 36.8807 69 35.5 69Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M45.5 69C44.1193 69 43 70.1193 43 71.5C43 72.8807 44.1193 74 45.5 74C46.8807 74 48 72.8807 48 71.5C48 70.1193 46.8807 69 45.5 69Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M55.5 69C54.1193 69 53 70.1193 53 71.5C53 72.8807 54.1193 74 55.5 74C56.8807 74 58 72.8807 58 71.5C58 70.1193 56.8807 69 55.5 69Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M65.5 69C64.1193 69 63 70.1193 63 71.5C63 72.8807 64.1193 74 65.5 74C66.8807 74 68 72.8807 68 71.5C68 70.1193 66.8807 69 65.5 69Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M75.5 69C74.1193 69 73 70.1193 73 71.5C73 72.8807 74.1193 74 75.5 74C76.8807 74 78 72.8807 78 71.5C78 70.1193 76.8807 69 75.5 69Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M85.5 69C84.1193 69 83 70.1193 83 71.5C83 72.8807 84.1193 74 85.5 74C86.8807 74 88 72.8807 88 71.5C88 70.1193 86.8807 69 85.5 69Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M306.5 462C305.119 462 304 463.119 304 464.5C304 465.881 305.119 467 306.5 467C307.881 467 309 465.881 309 464.5C309 463.119 307.881 462 306.5 462Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M316.5 462C315.119 462 314 463.119 314 464.5C314 465.881 315.119 467 316.5 467C317.881 467 319 465.881 319 464.5C319 463.119 317.881 462 316.5 462Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M326.5 462C325.119 462 324 463.119 324 464.5C324 465.881 325.119 467 326.5 467C327.881 467 329 465.881 329 464.5C329 463.119 327.881 462 326.5 462Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M336.5 462C335.119 462 334 463.119 334 464.5C334 465.881 335.119 467 336.5 467C337.881 467 339 465.881 339 464.5C339 463.119 337.881 462 336.5 462Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M346.5 462C345.119 462 344 463.119 344 464.5C344 465.881 345.119 467 346.5 467C347.881 467 349 465.881 349 464.5C349 463.119 347.881 462 346.5 462Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M356.5 462C355.119 462 354 463.119 354 464.5C354 465.881 355.119 467 356.5 467C357.881 467 359 465.881 359 464.5C359 463.119 357.881 462 356.5 462Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M366.5 462C365.119 462 364 463.119 364 464.5C364 465.881 365.119 467 366.5 467C367.881 467 369 465.881 369 464.5C369 463.119 367.881 462 366.5 462Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M306.5 452C305.119 452 304 453.119 304 454.5C304 455.881 305.119 457 306.5 457C307.881 457 309 455.881 309 454.5C309 453.119 307.881 452 306.5 452Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M316.5 452C315.119 452 314 453.119 314 454.5C314 455.881 315.119 457 316.5 457C317.881 457 319 455.881 319 454.5C319 453.119 317.881 452 316.5 452Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M326.5 452C325.119 452 324 453.119 324 454.5C324 455.881 325.119 457 326.5 457C327.881 457 329 455.881 329 454.5C329 453.119 327.881 452 326.5 452Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M336.5 452C335.119 452 334 453.119 334 454.5C334 455.881 335.119 457 336.5 457C337.881 457 339 455.881 339 454.5C339 453.119 337.881 452 336.5 452Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M346.5 452C345.119 452 344 453.119 344 454.5C344 455.881 345.119 457 346.5 457C347.881 457 349 455.881 349 454.5C349 453.119 347.881 452 346.5 452Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M356.5 452C355.119 452 354 453.119 354 454.5C354 455.881 355.119 457 356.5 457C357.881 457 359 455.881 359 454.5C359 453.119 357.881 452 356.5 452Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M366.5 452C365.119 452 364 453.119 364 454.5C364 455.881 365.119 457 366.5 457C367.881 457 369 455.881 369 454.5C369 453.119 367.881 452 366.5 452Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M306.5 442C305.119 442 304 443.119 304 444.5C304 445.881 305.119 447 306.5 447C307.881 447 309 445.881 309 444.5C309 443.119 307.881 442 306.5 442Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M316.5 442C315.119 442 314 443.119 314 444.5C314 445.881 315.119 447 316.5 447C317.881 447 319 445.881 319 444.5C319 443.119 317.881 442 316.5 442Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M326.5 442C325.119 442 324 443.119 324 444.5C324 445.881 325.119 447 326.5 447C327.881 447 329 445.881 329 444.5C329 443.119 327.881 442 326.5 442Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M336.5 442C335.119 442 334 443.119 334 444.5C334 445.881 335.119 447 336.5 447C337.881 447 339 445.881 339 444.5C339 443.119 337.881 442 336.5 442Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M346.5 442C345.119 442 344 443.119 344 444.5C344 445.881 345.119 447 346.5 447C347.881 447 349 445.881 349 444.5C349 443.119 347.881 442 346.5 442Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M356.5 442C355.119 442 354 443.119 354 444.5C354 445.881 355.119 447 356.5 447C357.881 447 359 445.881 359 444.5C359 443.119 357.881 442 356.5 442Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M366.5 442C365.119 442 364 443.119 364 444.5C364 445.881 365.119 447 366.5 447C367.881 447 369 445.881 369 444.5C369 443.119 367.881 442 366.5 442Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M306.5 432C305.119 432 304 433.119 304 434.5C304 435.881 305.119 437 306.5 437C307.881 437 309 435.881 309 434.5C309 433.119 307.881 432 306.5 432Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M316.5 432C315.119 432 314 433.119 314 434.5C314 435.881 315.119 437 316.5 437C317.881 437 319 435.881 319 434.5C319 433.119 317.881 432 316.5 432Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M326.5 432C325.119 432 324 433.119 324 434.5C324 435.881 325.119 437 326.5 437C327.881 437 329 435.881 329 434.5C329 433.119 327.881 432 326.5 432Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M336.5 432C335.119 432 334 433.119 334 434.5C334 435.881 335.119 437 336.5 437C337.881 437 339 435.881 339 434.5C339 433.119 337.881 432 336.5 432Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M346.5 432C345.119 432 344 433.119 344 434.5C344 435.881 345.119 437 346.5 437C347.881 437 349 435.881 349 434.5C349 433.119 347.881 432 346.5 432Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M356.5 432C355.119 432 354 433.119 354 434.5C354 435.881 355.119 437 356.5 437C357.881 437 359 435.881 359 434.5C359 433.119 357.881 432 356.5 432Z"
            fill="${secondary}"
          />
          <path
            class="Secondary"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M366.5 432C365.119 432 364 433.119 364 434.5C364 435.881 365.119 437 366.5 437C367.881 437 369 435.881 369 434.5C369 433.119 367.881 432 366.5 432Z"
            fill="${secondary}"
          />
        </g>
        <defs>
          <clipPath id="clip0_13_2195">
            <rect width="420" height="500" fill="white" />
          </clipPath>
        </defs>
      </svg>`,

      
    Triangle: (accent, primary, secondary) => `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="500" viewBox="0 0 420 500" fill="none">
    <rect class="Accent" width="420" height="500" fill="${accent}"/>
    <rect class="Secondary" x="271" y="59" width="80" height="80" fill="${secondary}"/>
    <rect class="Secondary" x="12" y="307" width="30" height="30" fill="${secondary}"/>
    <rect class="Secondary" opacity="0.4" x="286" y="221" width="40" height="40" fill="${secondary}"/>
    <rect class="Secondary" x="221" y="410" width="40" height="40" fill="${secondary}"/>
    <rect class="Secondary" x="81" y="15" width="40" height="40" fill="${secondary}"/>
    <rect class="Secondary" x="244.5" y="102.5" width="53" height="53" stroke="${secondary}" stroke-opacity="0.4" stroke-width="7"/>
    <rect class="Secondary" x="30.5" y="31.5" width="73" height="73" stroke="${secondary}" stroke-opacity="0.4" stroke-width="7"/>
    <rect class="Secondary" x="237.5" y="358.5" width="73" height="73" stroke="${secondary}" stroke-opacity="0.4" stroke-width="7"/>
    <rect class="Secondary" x="72.5" y="199.5" width="73" height="73" stroke="${secondary}" stroke-opacity="0.4" stroke-width="7"/>
    <rect class="Secondary" x="329.5" y="263.5" width="13" height="13" stroke="${secondary}" stroke-opacity="0.4" stroke-width="7"/>
    <g opacity="0.15">
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M358.5 12C359.881 12 361 10.8807 361 9.5C361 8.11929 359.881 7 358.5 7C357.119 7 356 8.11929 356 9.5C356 10.8807 357.119 12 358.5 12Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M358.5 20C359.881 20 361 18.8807 361 17.5C361 16.1193 359.881 15 358.5 15C357.119 15 356 16.1193 356 17.5C356 18.8807 357.119 20 358.5 20Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M358.5 28C359.881 28 361 26.8807 361 25.5C361 24.1193 359.881 23 358.5 23C357.119 23 356 24.1193 356 25.5C356 26.8807 357.119 28 358.5 28Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M358.5 36C359.881 36 361 34.8807 361 33.5C361 32.1193 359.881 31 358.5 31C357.119 31 356 32.1193 356 33.5C356 34.8807 357.119 36 358.5 36Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M358.5 44C359.881 44 361 42.8807 361 41.5C361 40.1193 359.881 39 358.5 39C357.119 39 356 40.1193 356 41.5C356 42.8807 357.119 44 358.5 44Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M358.5 52C359.881 52 361 50.8807 361 49.5C361 48.1193 359.881 47 358.5 47C357.119 47 356 48.1193 356 49.5C356 50.8807 357.119 52 358.5 52Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M358.5 60C359.881 60 361 58.8807 361 57.5C361 56.1193 359.881 55 358.5 55C357.119 55 356 56.1193 356 57.5C356 58.8807 357.119 60 358.5 60Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M358.5 68C359.881 68 361 66.8807 361 65.5C361 64.1193 359.881 63 358.5 63C357.119 63 356 64.1193 356 65.5C356 66.8807 357.119 68 358.5 68Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M358.5 76C359.881 76 361 74.8807 361 73.5C361 72.1193 359.881 71 358.5 71C357.119 71 356 72.1193 356 73.5C356 74.8807 357.119 76 358.5 76Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M358.5 84C359.881 84 361 82.8807 361 81.5C361 80.1193 359.881 79 358.5 79C357.119 79 356 80.1193 356 81.5C356 82.8807 357.119 84 358.5 84Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M358.5 92C359.881 92 361 90.8807 361 89.5C361 88.1193 359.881 87 358.5 87C357.119 87 356 88.1193 356 89.5C356 90.8807 357.119 92 358.5 92Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M358.5 100C359.881 100 361 98.8807 361 97.5C361 96.1193 359.881 95 358.5 95C357.119 95 356 96.1193 356 97.5C356 98.8807 357.119 100 358.5 100Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M358.5 108C359.881 108 361 106.881 361 105.5C361 104.119 359.881 103 358.5 103C357.119 103 356 104.119 356 105.5C356 106.881 357.119 108 358.5 108Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M358.5 116C359.881 116 361 114.881 361 113.5C361 112.119 359.881 111 358.5 111C357.119 111 356 112.119 356 113.5C356 114.881 357.119 116 358.5 116Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M368.5 12C369.881 12 371 10.8807 371 9.5C371 8.11929 369.881 7 368.5 7C367.119 7 366 8.11929 366 9.5C366 10.8807 367.119 12 368.5 12Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M368.5 20C369.881 20 371 18.8807 371 17.5C371 16.1193 369.881 15 368.5 15C367.119 15 366 16.1193 366 17.5C366 18.8807 367.119 20 368.5 20Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M368.5 28C369.881 28 371 26.8807 371 25.5C371 24.1193 369.881 23 368.5 23C367.119 23 366 24.1193 366 25.5C366 26.8807 367.119 28 368.5 28Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M368.5 36C369.881 36 371 34.8807 371 33.5C371 32.1193 369.881 31 368.5 31C367.119 31 366 32.1193 366 33.5C366 34.8807 367.119 36 368.5 36Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M368.5 44C369.881 44 371 42.8807 371 41.5C371 40.1193 369.881 39 368.5 39C367.119 39 366 40.1193 366 41.5C366 42.8807 367.119 44 368.5 44Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M368.5 52C369.881 52 371 50.8807 371 49.5C371 48.1193 369.881 47 368.5 47C367.119 47 366 48.1193 366 49.5C366 50.8807 367.119 52 368.5 52Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M368.5 60C369.881 60 371 58.8807 371 57.5C371 56.1193 369.881 55 368.5 55C367.119 55 366 56.1193 366 57.5C366 58.8807 367.119 60 368.5 60Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M368.5 68C369.881 68 371 66.8807 371 65.5C371 64.1193 369.881 63 368.5 63C367.119 63 366 64.1193 366 65.5C366 66.8807 367.119 68 368.5 68Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M368.5 76C369.881 76 371 74.8807 371 73.5C371 72.1193 369.881 71 368.5 71C367.119 71 366 72.1193 366 73.5C366 74.8807 367.119 76 368.5 76Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M368.5 84C369.881 84 371 82.8807 371 81.5C371 80.1193 369.881 79 368.5 79C367.119 79 366 80.1193 366 81.5C366 82.8807 367.119 84 368.5 84Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M368.5 92C369.881 92 371 90.8807 371 89.5C371 88.1193 369.881 87 368.5 87C367.119 87 366 88.1193 366 89.5C366 90.8807 367.119 92 368.5 92Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M368.5 100C369.881 100 371 98.8807 371 97.5C371 96.1193 369.881 95 368.5 95C367.119 95 366 96.1193 366 97.5C366 98.8807 367.119 100 368.5 100Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M368.5 108C369.881 108 371 106.881 371 105.5C371 104.119 369.881 103 368.5 103C367.119 103 366 104.119 366 105.5C366 106.881 367.119 108 368.5 108Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M368.5 116C369.881 116 371 114.881 371 113.5C371 112.119 369.881 111 368.5 111C367.119 111 366 112.119 366 113.5C366 114.881 367.119 116 368.5 116Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M378.5 12C379.881 12 381 10.8807 381 9.5C381 8.11929 379.881 7 378.5 7C377.119 7 376 8.11929 376 9.5C376 10.8807 377.119 12 378.5 12Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M378.5 20C379.881 20 381 18.8807 381 17.5C381 16.1193 379.881 15 378.5 15C377.119 15 376 16.1193 376 17.5C376 18.8807 377.119 20 378.5 20Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M378.5 28C379.881 28 381 26.8807 381 25.5C381 24.1193 379.881 23 378.5 23C377.119 23 376 24.1193 376 25.5C376 26.8807 377.119 28 378.5 28Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M378.5 36C379.881 36 381 34.8807 381 33.5C381 32.1193 379.881 31 378.5 31C377.119 31 376 32.1193 376 33.5C376 34.8807 377.119 36 378.5 36Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M378.5 44C379.881 44 381 42.8807 381 41.5C381 40.1193 379.881 39 378.5 39C377.119 39 376 40.1193 376 41.5C376 42.8807 377.119 44 378.5 44Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M378.5 52C379.881 52 381 50.8807 381 49.5C381 48.1193 379.881 47 378.5 47C377.119 47 376 48.1193 376 49.5C376 50.8807 377.119 52 378.5 52Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M378.5 60C379.881 60 381 58.8807 381 57.5C381 56.1193 379.881 55 378.5 55C377.119 55 376 56.1193 376 57.5C376 58.8807 377.119 60 378.5 60Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M378.5 68C379.881 68 381 66.8807 381 65.5C381 64.1193 379.881 63 378.5 63C377.119 63 376 64.1193 376 65.5C376 66.8807 377.119 68 378.5 68Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M378.5 76C379.881 76 381 74.8807 381 73.5C381 72.1193 379.881 71 378.5 71C377.119 71 376 72.1193 376 73.5C376 74.8807 377.119 76 378.5 76Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M378.5 84C379.881 84 381 82.8807 381 81.5C381 80.1193 379.881 79 378.5 79C377.119 79 376 80.1193 376 81.5C376 82.8807 377.119 84 378.5 84Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M378.5 92C379.881 92 381 90.8807 381 89.5C381 88.1193 379.881 87 378.5 87C377.119 87 376 88.1193 376 89.5C376 90.8807 377.119 92 378.5 92Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M378.5 100C379.881 100 381 98.8807 381 97.5C381 96.1193 379.881 95 378.5 95C377.119 95 376 96.1193 376 97.5C376 98.8807 377.119 100 378.5 100Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M378.5 108C379.881 108 381 106.881 381 105.5C381 104.119 379.881 103 378.5 103C377.119 103 376 104.119 376 105.5C376 106.881 377.119 108 378.5 108Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M378.5 116C379.881 116 381 114.881 381 113.5C381 112.119 379.881 111 378.5 111C377.119 111 376 112.119 376 113.5C376 114.881 377.119 116 378.5 116Z" fill="${primary}"/>
    </g>
    <g opacity="0.15">
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M41.5 381C42.8807 381 44 379.881 44 378.5C44 377.119 42.8807 376 41.5 376C40.1193 376 39 377.119 39 378.5C39 379.881 40.1193 381 41.5 381Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M41.5 389C42.8807 389 44 387.881 44 386.5C44 385.119 42.8807 384 41.5 384C40.1193 384 39 385.119 39 386.5C39 387.881 40.1193 389 41.5 389Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M41.5 397C42.8807 397 44 395.881 44 394.5C44 393.119 42.8807 392 41.5 392C40.1193 392 39 393.119 39 394.5C39 395.881 40.1193 397 41.5 397Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M41.5 405C42.8807 405 44 403.881 44 402.5C44 401.119 42.8807 400 41.5 400C40.1193 400 39 401.119 39 402.5C39 403.881 40.1193 405 41.5 405Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M41.5 413C42.8807 413 44 411.881 44 410.5C44 409.119 42.8807 408 41.5 408C40.1193 408 39 409.119 39 410.5C39 411.881 40.1193 413 41.5 413Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M41.5 421C42.8807 421 44 419.881 44 418.5C44 417.119 42.8807 416 41.5 416C40.1193 416 39 417.119 39 418.5C39 419.881 40.1193 421 41.5 421Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M41.5 429C42.8807 429 44 427.881 44 426.5C44 425.119 42.8807 424 41.5 424C40.1193 424 39 425.119 39 426.5C39 427.881 40.1193 429 41.5 429Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M41.5 437C42.8807 437 44 435.881 44 434.5C44 433.119 42.8807 432 41.5 432C40.1193 432 39 433.119 39 434.5C39 435.881 40.1193 437 41.5 437Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M41.5 445C42.8807 445 44 443.881 44 442.5C44 441.119 42.8807 440 41.5 440C40.1193 440 39 441.119 39 442.5C39 443.881 40.1193 445 41.5 445Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M41.5 453C42.8807 453 44 451.881 44 450.5C44 449.119 42.8807 448 41.5 448C40.1193 448 39 449.119 39 450.5C39 451.881 40.1193 453 41.5 453Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M41.5 461C42.8807 461 44 459.881 44 458.5C44 457.119 42.8807 456 41.5 456C40.1193 456 39 457.119 39 458.5C39 459.881 40.1193 461 41.5 461Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M41.5 469C42.8807 469 44 467.881 44 466.5C44 465.119 42.8807 464 41.5 464C40.1193 464 39 465.119 39 466.5C39 467.881 40.1193 469 41.5 469Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M41.5 477C42.8807 477 44 475.881 44 474.5C44 473.119 42.8807 472 41.5 472C40.1193 472 39 473.119 39 474.5C39 475.881 40.1193 477 41.5 477Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M41.5 485C42.8807 485 44 483.881 44 482.5C44 481.119 42.8807 480 41.5 480C40.1193 480 39 481.119 39 482.5C39 483.881 40.1193 485 41.5 485Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M51.5 381C52.8807 381 54 379.881 54 378.5C54 377.119 52.8807 376 51.5 376C50.1193 376 49 377.119 49 378.5C49 379.881 50.1193 381 51.5 381Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M51.5 389C52.8807 389 54 387.881 54 386.5C54 385.119 52.8807 384 51.5 384C50.1193 384 49 385.119 49 386.5C49 387.881 50.1193 389 51.5 389Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M51.5 397C52.8807 397 54 395.881 54 394.5C54 393.119 52.8807 392 51.5 392C50.1193 392 49 393.119 49 394.5C49 395.881 50.1193 397 51.5 397Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M51.5 405C52.8807 405 54 403.881 54 402.5C54 401.119 52.8807 400 51.5 400C50.1193 400 49 401.119 49 402.5C49 403.881 50.1193 405 51.5 405Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M51.5 413C52.8807 413 54 411.881 54 410.5C54 409.119 52.8807 408 51.5 408C50.1193 408 49 409.119 49 410.5C49 411.881 50.1193 413 51.5 413Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M51.5 421C52.8807 421 54 419.881 54 418.5C54 417.119 52.8807 416 51.5 416C50.1193 416 49 417.119 49 418.5C49 419.881 50.1193 421 51.5 421Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M51.5 429C52.8807 429 54 427.881 54 426.5C54 425.119 52.8807 424 51.5 424C50.1193 424 49 425.119 49 426.5C49 427.881 50.1193 429 51.5 429Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M51.5 437C52.8807 437 54 435.881 54 434.5C54 433.119 52.8807 432 51.5 432C50.1193 432 49 433.119 49 434.5C49 435.881 50.1193 437 51.5 437Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M51.5 445C52.8807 445 54 443.881 54 442.5C54 441.119 52.8807 440 51.5 440C50.1193 440 49 441.119 49 442.5C49 443.881 50.1193 445 51.5 445Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M51.5 453C52.8807 453 54 451.881 54 450.5C54 449.119 52.8807 448 51.5 448C50.1193 448 49 449.119 49 450.5C49 451.881 50.1193 453 51.5 453Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M51.5 461C52.8807 461 54 459.881 54 458.5C54 457.119 52.8807 456 51.5 456C50.1193 456 49 457.119 49 458.5C49 459.881 50.1193 461 51.5 461Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M51.5 469C52.8807 469 54 467.881 54 466.5C54 465.119 52.8807 464 51.5 464C50.1193 464 49 465.119 49 466.5C49 467.881 50.1193 469 51.5 469Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M51.5 477C52.8807 477 54 475.881 54 474.5C54 473.119 52.8807 472 51.5 472C50.1193 472 49 473.119 49 474.5C49 475.881 50.1193 477 51.5 477Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M51.5 485C52.8807 485 54 483.881 54 482.5C54 481.119 52.8807 480 51.5 480C50.1193 480 49 481.119 49 482.5C49 483.881 50.1193 485 51.5 485Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M61.5 381C62.8807 381 64 379.881 64 378.5C64 377.119 62.8807 376 61.5 376C60.1193 376 59 377.119 59 378.5C59 379.881 60.1193 381 61.5 381Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M61.5 389C62.8807 389 64 387.881 64 386.5C64 385.119 62.8807 384 61.5 384C60.1193 384 59 385.119 59 386.5C59 387.881 60.1193 389 61.5 389Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M61.5 397C62.8807 397 64 395.881 64 394.5C64 393.119 62.8807 392 61.5 392C60.1193 392 59 393.119 59 394.5C59 395.881 60.1193 397 61.5 397Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M61.5 405C62.8807 405 64 403.881 64 402.5C64 401.119 62.8807 400 61.5 400C60.1193 400 59 401.119 59 402.5C59 403.881 60.1193 405 61.5 405Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M61.5 413C62.8807 413 64 411.881 64 410.5C64 409.119 62.8807 408 61.5 408C60.1193 408 59 409.119 59 410.5C59 411.881 60.1193 413 61.5 413Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M61.5 421C62.8807 421 64 419.881 64 418.5C64 417.119 62.8807 416 61.5 416C60.1193 416 59 417.119 59 418.5C59 419.881 60.1193 421 61.5 421Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M61.5 429C62.8807 429 64 427.881 64 426.5C64 425.119 62.8807 424 61.5 424C60.1193 424 59 425.119 59 426.5C59 427.881 60.1193 429 61.5 429Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M61.5 437C62.8807 437 64 435.881 64 434.5C64 433.119 62.8807 432 61.5 432C60.1193 432 59 433.119 59 434.5C59 435.881 60.1193 437 61.5 437Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M61.5 445C62.8807 445 64 443.881 64 442.5C64 441.119 62.8807 440 61.5 440C60.1193 440 59 441.119 59 442.5C59 443.881 60.1193 445 61.5 445Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M61.5 453C62.8807 453 64 451.881 64 450.5C64 449.119 62.8807 448 61.5 448C60.1193 448 59 449.119 59 450.5C59 451.881 60.1193 453 61.5 453Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M61.5 461C62.8807 461 64 459.881 64 458.5C64 457.119 62.8807 456 61.5 456C60.1193 456 59 457.119 59 458.5C59 459.881 60.1193 461 61.5 461Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M61.5 469C62.8807 469 64 467.881 64 466.5C64 465.119 62.8807 464 61.5 464C60.1193 464 59 465.119 59 466.5C59 467.881 60.1193 469 61.5 469Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M61.5 477C62.8807 477 64 475.881 64 474.5C64 473.119 62.8807 472 61.5 472C60.1193 472 59 473.119 59 474.5C59 475.881 60.1193 477 61.5 477Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M61.5 485C62.8807 485 64 483.881 64 482.5C64 481.119 62.8807 480 61.5 480C60.1193 480 59 481.119 59 482.5C59 483.881 60.1193 485 61.5 485Z" fill="${primary}"/>
    </g>
    <g opacity="0.15">
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M18 139.5C18 138.119 16.8807 137 15.5 137C14.1193 137 13 138.119 13 139.5C13 140.881 14.1193 142 15.5 142C16.8807 142 18 140.881 18 139.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M26 139.5C26 138.119 24.8807 137 23.5 137C22.1193 137 21 138.119 21 139.5C21 140.881 22.1193 142 23.5 142C24.8807 142 26 140.881 26 139.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M34 139.5C34 138.119 32.8807 137 31.5 137C30.1193 137 29 138.119 29 139.5C29 140.881 30.1193 142 31.5 142C32.8807 142 34 140.881 34 139.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M42 139.5C42 138.119 40.8807 137 39.5 137C38.1193 137 37 138.119 37 139.5C37 140.881 38.1193 142 39.5 142C40.8807 142 42 140.881 42 139.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M50 139.5C50 138.119 48.8807 137 47.5 137C46.1193 137 45 138.119 45 139.5C45 140.881 46.1193 142 47.5 142C48.8807 142 50 140.881 50 139.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M58 139.5C58 138.119 56.8807 137 55.5 137C54.1193 137 53 138.119 53 139.5C53 140.881 54.1193 142 55.5 142C56.8807 142 58 140.881 58 139.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M66 139.5C66 138.119 64.8807 137 63.5 137C62.1193 137 61 138.119 61 139.5C61 140.881 62.1193 142 63.5 142C64.8807 142 66 140.881 66 139.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M74 139.5C74 138.119 72.8807 137 71.5 137C70.1193 137 69 138.119 69 139.5C69 140.881 70.1193 142 71.5 142C72.8807 142 74 140.881 74 139.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M82 139.5C82 138.119 80.8807 137 79.5 137C78.1193 137 77 138.119 77 139.5C77 140.881 78.1193 142 79.5 142C80.8807 142 82 140.881 82 139.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M90 139.5C90 138.119 88.8807 137 87.5 137C86.1193 137 85 138.119 85 139.5C85 140.881 86.1193 142 87.5 142C88.8807 142 90 140.881 90 139.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M98 139.5C98 138.119 96.8807 137 95.5 137C94.1193 137 93 138.119 93 139.5C93 140.881 94.1193 142 95.5 142C96.8807 142 98 140.881 98 139.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M106 139.5C106 138.119 104.881 137 103.5 137C102.119 137 101 138.119 101 139.5C101 140.881 102.119 142 103.5 142C104.881 142 106 140.881 106 139.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M114 139.5C114 138.119 112.881 137 111.5 137C110.119 137 109 138.119 109 139.5C109 140.881 110.119 142 111.5 142C112.881 142 114 140.881 114 139.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M122 139.5C122 138.119 120.881 137 119.5 137C118.119 137 117 138.119 117 139.5C117 140.881 118.119 142 119.5 142C120.881 142 122 140.881 122 139.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M18 129.5C18 128.119 16.8807 127 15.5 127C14.1193 127 13 128.119 13 129.5C13 130.881 14.1193 132 15.5 132C16.8807 132 18 130.881 18 129.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M26 129.5C26 128.119 24.8807 127 23.5 127C22.1193 127 21 128.119 21 129.5C21 130.881 22.1193 132 23.5 132C24.8807 132 26 130.881 26 129.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M34 129.5C34 128.119 32.8807 127 31.5 127C30.1193 127 29 128.119 29 129.5C29 130.881 30.1193 132 31.5 132C32.8807 132 34 130.881 34 129.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M42 129.5C42 128.119 40.8807 127 39.5 127C38.1193 127 37 128.119 37 129.5C37 130.881 38.1193 132 39.5 132C40.8807 132 42 130.881 42 129.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M50 129.5C50 128.119 48.8807 127 47.5 127C46.1193 127 45 128.119 45 129.5C45 130.881 46.1193 132 47.5 132C48.8807 132 50 130.881 50 129.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M58 129.5C58 128.119 56.8807 127 55.5 127C54.1193 127 53 128.119 53 129.5C53 130.881 54.1193 132 55.5 132C56.8807 132 58 130.881 58 129.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M66 129.5C66 128.119 64.8807 127 63.5 127C62.1193 127 61 128.119 61 129.5C61 130.881 62.1193 132 63.5 132C64.8807 132 66 130.881 66 129.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M74 129.5C74 128.119 72.8807 127 71.5 127C70.1193 127 69 128.119 69 129.5C69 130.881 70.1193 132 71.5 132C72.8807 132 74 130.881 74 129.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M82 129.5C82 128.119 80.8807 127 79.5 127C78.1193 127 77 128.119 77 129.5C77 130.881 78.1193 132 79.5 132C80.8807 132 82 130.881 82 129.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M90 129.5C90 128.119 88.8807 127 87.5 127C86.1193 127 85 128.119 85 129.5C85 130.881 86.1193 132 87.5 132C88.8807 132 90 130.881 90 129.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M98 129.5C98 128.119 96.8807 127 95.5 127C94.1193 127 93 128.119 93 129.5C93 130.881 94.1193 132 95.5 132C96.8807 132 98 130.881 98 129.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M106 129.5C106 128.119 104.881 127 103.5 127C102.119 127 101 128.119 101 129.5C101 130.881 102.119 132 103.5 132C104.881 132 106 130.881 106 129.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M114 129.5C114 128.119 112.881 127 111.5 127C110.119 127 109 128.119 109 129.5C109 130.881 110.119 132 111.5 132C112.881 132 114 130.881 114 129.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M122 129.5C122 128.119 120.881 127 119.5 127C118.119 127 117 128.119 117 129.5C117 130.881 118.119 132 119.5 132C120.881 132 122 130.881 122 129.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M18 119.5C18 118.119 16.8807 117 15.5 117C14.1193 117 13 118.119 13 119.5C13 120.881 14.1193 122 15.5 122C16.8807 122 18 120.881 18 119.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M26 119.5C26 118.119 24.8807 117 23.5 117C22.1193 117 21 118.119 21 119.5C21 120.881 22.1193 122 23.5 122C24.8807 122 26 120.881 26 119.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M34 119.5C34 118.119 32.8807 117 31.5 117C30.1193 117 29 118.119 29 119.5C29 120.881 30.1193 122 31.5 122C32.8807 122 34 120.881 34 119.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M42 119.5C42 118.119 40.8807 117 39.5 117C38.1193 117 37 118.119 37 119.5C37 120.881 38.1193 122 39.5 122C40.8807 122 42 120.881 42 119.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M50 119.5C50 118.119 48.8807 117 47.5 117C46.1193 117 45 118.119 45 119.5C45 120.881 46.1193 122 47.5 122C48.8807 122 50 120.881 50 119.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M58 119.5C58 118.119 56.8807 117 55.5 117C54.1193 117 53 118.119 53 119.5C53 120.881 54.1193 122 55.5 122C56.8807 122 58 120.881 58 119.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M66 119.5C66 118.119 64.8807 117 63.5 117C62.1193 117 61 118.119 61 119.5C61 120.881 62.1193 122 63.5 122C64.8807 122 66 120.881 66 119.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M74 119.5C74 118.119 72.8807 117 71.5 117C70.1193 117 69 118.119 69 119.5C69 120.881 70.1193 122 71.5 122C72.8807 122 74 120.881 74 119.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M82 119.5C82 118.119 80.8807 117 79.5 117C78.1193 117 77 118.119 77 119.5C77 120.881 78.1193 122 79.5 122C80.8807 122 82 120.881 82 119.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M90 119.5C90 118.119 88.8807 117 87.5 117C86.1193 117 85 118.119 85 119.5C85 120.881 86.1193 122 87.5 122C88.8807 122 90 120.881 90 119.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M98 119.5C98 118.119 96.8807 117 95.5 117C94.1193 117 93 118.119 93 119.5C93 120.881 94.1193 122 95.5 122C96.8807 122 98 120.881 98 119.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M106 119.5C106 118.119 104.881 117 103.5 117C102.119 117 101 118.119 101 119.5C101 120.881 102.119 122 103.5 122C104.881 122 106 120.881 106 119.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M114 119.5C114 118.119 112.881 117 111.5 117C110.119 117 109 118.119 109 119.5C109 120.881 110.119 122 111.5 122C112.881 122 114 120.881 114 119.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M122 119.5C122 118.119 120.881 117 119.5 117C118.119 117 117 118.119 117 119.5C117 120.881 118.119 122 119.5 122C120.881 122 122 120.881 122 119.5Z" fill="${primary}"/>
    </g>
    <g opacity="0.15">
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M306 472.5C306 471.119 304.881 470 303.5 470C302.119 470 301 471.119 301 472.5C301 473.881 302.119 475 303.5 475C304.881 475 306 473.881 306 472.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M314 472.5C314 471.119 312.881 470 311.5 470C310.119 470 309 471.119 309 472.5C309 473.881 310.119 475 311.5 475C312.881 475 314 473.881 314 472.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M322 472.5C322 471.119 320.881 470 319.5 470C318.119 470 317 471.119 317 472.5C317 473.881 318.119 475 319.5 475C320.881 475 322 473.881 322 472.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M330 472.5C330 471.119 328.881 470 327.5 470C326.119 470 325 471.119 325 472.5C325 473.881 326.119 475 327.5 475C328.881 475 330 473.881 330 472.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M338 472.5C338 471.119 336.881 470 335.5 470C334.119 470 333 471.119 333 472.5C333 473.881 334.119 475 335.5 475C336.881 475 338 473.881 338 472.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M346 472.5C346 471.119 344.881 470 343.5 470C342.119 470 341 471.119 341 472.5C341 473.881 342.119 475 343.5 475C344.881 475 346 473.881 346 472.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M354 472.5C354 471.119 352.881 470 351.5 470C350.119 470 349 471.119 349 472.5C349 473.881 350.119 475 351.5 475C352.881 475 354 473.881 354 472.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M362 472.5C362 471.119 360.881 470 359.5 470C358.119 470 357 471.119 357 472.5C357 473.881 358.119 475 359.5 475C360.881 475 362 473.881 362 472.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M370 472.5C370 471.119 368.881 470 367.5 470C366.119 470 365 471.119 365 472.5C365 473.881 366.119 475 367.5 475C368.881 475 370 473.881 370 472.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M378 472.5C378 471.119 376.881 470 375.5 470C374.119 470 373 471.119 373 472.5C373 473.881 374.119 475 375.5 475C376.881 475 378 473.881 378 472.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M386 472.5C386 471.119 384.881 470 383.5 470C382.119 470 381 471.119 381 472.5C381 473.881 382.119 475 383.5 475C384.881 475 386 473.881 386 472.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M394 472.5C394 471.119 392.881 470 391.5 470C390.119 470 389 471.119 389 472.5C389 473.881 390.119 475 391.5 475C392.881 475 394 473.881 394 472.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M402 472.5C402 471.119 400.881 470 399.5 470C398.119 470 397 471.119 397 472.5C397 473.881 398.119 475 399.5 475C400.881 475 402 473.881 402 472.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M410 472.5C410 471.119 408.881 470 407.5 470C406.119 470 405 471.119 405 472.5C405 473.881 406.119 475 407.5 475C408.881 475 410 473.881 410 472.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M306 462.5C306 461.119 304.881 460 303.5 460C302.119 460 301 461.119 301 462.5C301 463.881 302.119 465 303.5 465C304.881 465 306 463.881 306 462.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M314 462.5C314 461.119 312.881 460 311.5 460C310.119 460 309 461.119 309 462.5C309 463.881 310.119 465 311.5 465C312.881 465 314 463.881 314 462.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M322 462.5C322 461.119 320.881 460 319.5 460C318.119 460 317 461.119 317 462.5C317 463.881 318.119 465 319.5 465C320.881 465 322 463.881 322 462.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M330 462.5C330 461.119 328.881 460 327.5 460C326.119 460 325 461.119 325 462.5C325 463.881 326.119 465 327.5 465C328.881 465 330 463.881 330 462.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M338 462.5C338 461.119 336.881 460 335.5 460C334.119 460 333 461.119 333 462.5C333 463.881 334.119 465 335.5 465C336.881 465 338 463.881 338 462.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M346 462.5C346 461.119 344.881 460 343.5 460C342.119 460 341 461.119 341 462.5C341 463.881 342.119 465 343.5 465C344.881 465 346 463.881 346 462.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M354 462.5C354 461.119 352.881 460 351.5 460C350.119 460 349 461.119 349 462.5C349 463.881 350.119 465 351.5 465C352.881 465 354 463.881 354 462.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M362 462.5C362 461.119 360.881 460 359.5 460C358.119 460 357 461.119 357 462.5C357 463.881 358.119 465 359.5 465C360.881 465 362 463.881 362 462.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M370 462.5C370 461.119 368.881 460 367.5 460C366.119 460 365 461.119 365 462.5C365 463.881 366.119 465 367.5 465C368.881 465 370 463.881 370 462.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M378 462.5C378 461.119 376.881 460 375.5 460C374.119 460 373 461.119 373 462.5C373 463.881 374.119 465 375.5 465C376.881 465 378 463.881 378 462.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M386 462.5C386 461.119 384.881 460 383.5 460C382.119 460 381 461.119 381 462.5C381 463.881 382.119 465 383.5 465C384.881 465 386 463.881 386 462.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M394 462.5C394 461.119 392.881 460 391.5 460C390.119 460 389 461.119 389 462.5C389 463.881 390.119 465 391.5 465C392.881 465 394 463.881 394 462.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M402 462.5C402 461.119 400.881 460 399.5 460C398.119 460 397 461.119 397 462.5C397 463.881 398.119 465 399.5 465C400.881 465 402 463.881 402 462.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M410 462.5C410 461.119 408.881 460 407.5 460C406.119 460 405 461.119 405 462.5C405 463.881 406.119 465 407.5 465C408.881 465 410 463.881 410 462.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M306 452.5C306 451.119 304.881 450 303.5 450C302.119 450 301 451.119 301 452.5C301 453.881 302.119 455 303.5 455C304.881 455 306 453.881 306 452.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M314 452.5C314 451.119 312.881 450 311.5 450C310.119 450 309 451.119 309 452.5C309 453.881 310.119 455 311.5 455C312.881 455 314 453.881 314 452.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M322 452.5C322 451.119 320.881 450 319.5 450C318.119 450 317 451.119 317 452.5C317 453.881 318.119 455 319.5 455C320.881 455 322 453.881 322 452.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M330 452.5C330 451.119 328.881 450 327.5 450C326.119 450 325 451.119 325 452.5C325 453.881 326.119 455 327.5 455C328.881 455 330 453.881 330 452.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M338 452.5C338 451.119 336.881 450 335.5 450C334.119 450 333 451.119 333 452.5C333 453.881 334.119 455 335.5 455C336.881 455 338 453.881 338 452.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M346 452.5C346 451.119 344.881 450 343.5 450C342.119 450 341 451.119 341 452.5C341 453.881 342.119 455 343.5 455C344.881 455 346 453.881 346 452.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M354 452.5C354 451.119 352.881 450 351.5 450C350.119 450 349 451.119 349 452.5C349 453.881 350.119 455 351.5 455C352.881 455 354 453.881 354 452.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M362 452.5C362 451.119 360.881 450 359.5 450C358.119 450 357 451.119 357 452.5C357 453.881 358.119 455 359.5 455C360.881 455 362 453.881 362 452.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M370 452.5C370 451.119 368.881 450 367.5 450C366.119 450 365 451.119 365 452.5C365 453.881 366.119 455 367.5 455C368.881 455 370 453.881 370 452.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M378 452.5C378 451.119 376.881 450 375.5 450C374.119 450 373 451.119 373 452.5C373 453.881 374.119 455 375.5 455C376.881 455 378 453.881 378 452.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M386 452.5C386 451.119 384.881 450 383.5 450C382.119 450 381 451.119 381 452.5C381 453.881 382.119 455 383.5 455C384.881 455 386 453.881 386 452.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M394 452.5C394 451.119 392.881 450 391.5 450C390.119 450 389 451.119 389 452.5C389 453.881 390.119 455 391.5 455C392.881 455 394 453.881 394 452.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M402 452.5C402 451.119 400.881 450 399.5 450C398.119 450 397 451.119 397 452.5C397 453.881 398.119 455 399.5 455C400.881 455 402 453.881 402 452.5Z" fill="${primary}"/>
    <path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M410 452.5C410 451.119 408.881 450 407.5 450C406.119 450 405 451.119 405 452.5C405 453.881 406.119 455 407.5 455C408.881 455 410 453.881 410 452.5Z" fill="${primary}"/>
    </g>
</svg>`,

Circle: (accent, primary) => `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="500" viewBox="0 0 420 500" fill="none">
<g clip-path="url(#clip0_19_860)">
<rect class="Accent" width="420" height="500" fill="${accent}"/>
<g opacity="0.5" filter="url(#filter0_dd_19_860)">
<rect class="Primary" x="351" y="435" width="60" height="60" fill="${primary}"/>
</g>
<g opacity="0.7" filter="url(#filter1_dd_19_860)">
<rect class="Primary" x="302" y="364" width="91" height="91" fill="${primary}"/>
</g>
<g opacity="0.6" filter="url(#filter2_dd_19_860)">
<rect class="Primary" x="113" y="171" width="42" height="42" fill="${primary}"/>
</g>
<g filter="url(#filter3_dd_19_860)">
<rect class="Primary" x="33" y="171" width="60" height="60" fill="${primary}" fill-opacity="0.4" shape-rendering="crispEdges"/>
</g>
<g filter="url(#filter4_dd_19_860)">
<rect class="Primary" x="73" y="8" width="40" height="40" fill="${primary}"/>
</g>
<g filter="url(#filter5_dd_19_860)">
<rect class="Primary" x="9" y="26" width="80" height="80" fill="${primary}" fill-opacity="0.5" shape-rendering="crispEdges"/>
</g>
<g opacity="0.4" filter="url(#filter6_dd_19_860)">
<rect class="Primary" x="295" y="287" width="63" height="63" fill="${primary}"/>
</g>
<g filter="url(#filter7_dd_19_860)">
<rect class="Primary" x="83" y="118" width="60" height="60" fill="${primary}" fill-opacity="0.7" shape-rendering="crispEdges"/>
</g>
<g opacity="0.5" filter="url(#filter8_dd_19_860)">
<rect class="Primary" x="63" y="88" width="40" height="40" fill="${primary}"/>
</g>
<g opacity="0.4" filter="url(#filter9_dd_19_860)">
<rect class="Primary" x="275" y="259" width="40" height="40" fill="${primary}"/>
</g>
<g opacity="0.5" filter="url(#filter10_dd_19_860)">
<rect class="Primary" x="286" y="435" width="40" height="40" fill="${primary}"/>
</g>
<g filter="url(#filter11_d_19_860)">
<rect class="Primary" x="422" y="380" width="40" height="40" fill="${primary}"/>
</g>
<g opacity="0.4" filter="url(#filter12_dd_19_860)">
<rect class="Primary" x="21" y="122" width="40" height="40" fill="${primary}"/>
</g>
<g opacity="0.4" filter="url(#filter13_dd_19_860)">
<rect class="Primary" x="341" y="320" width="60" height="60" fill="${primary}"/>
</g>
<g opacity="0.3" filter="url(#filter14_dd_19_860)">
<rect class="Primary" x="282" y="344" width="40" height="40" fill="${primary}"/>
</g>
</g>
<defs>
<filter id="filter0_dd_19_860" x="347" y="431" width="68" height="68" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="2" dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_19_860"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_19_860" result="effect2_dropShadow_19_860"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_19_860" result="shape"/>
</filter>
<filter id="filter1_dd_19_860" x="298" y="360" width="99" height="99" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="2" dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_19_860"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_19_860" result="effect2_dropShadow_19_860"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_19_860" result="shape"/>
</filter>
<filter id="filter2_dd_19_860" x="109" y="167" width="50" height="50" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="2" dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_19_860"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_19_860" result="effect2_dropShadow_19_860"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_19_860" result="shape"/>
</filter>
<filter id="filter3_dd_19_860" x="29" y="167" width="68" height="68" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="2" dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_19_860"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_19_860" result="effect2_dropShadow_19_860"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_19_860" result="shape"/>
</filter>
<filter id="filter4_dd_19_860" x="69" y="4" width="48" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="2" dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_19_860"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_19_860" result="effect2_dropShadow_19_860"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_19_860" result="shape"/>
</filter>
<filter id="filter5_dd_19_860" x="5" y="22" width="88" height="88" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="2" dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_19_860"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_19_860" result="effect2_dropShadow_19_860"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_19_860" result="shape"/>
</filter>
<filter id="filter6_dd_19_860" x="291" y="283" width="71" height="71" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="2" dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_19_860"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_19_860" result="effect2_dropShadow_19_860"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_19_860" result="shape"/>
</filter>
<filter id="filter7_dd_19_860" x="79" y="114" width="68" height="68" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="2" dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_19_860"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_19_860" result="effect2_dropShadow_19_860"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_19_860" result="shape"/>
</filter>
<filter id="filter8_dd_19_860" x="59" y="84" width="48" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="2" dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_19_860"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_19_860" result="effect2_dropShadow_19_860"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_19_860" result="shape"/>
</filter>
<filter id="filter9_dd_19_860" x="271" y="255" width="48" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="2" dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_19_860"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_19_860" result="effect2_dropShadow_19_860"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_19_860" result="shape"/>
</filter>
<filter id="filter10_dd_19_860" x="282" y="431" width="48" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="2" dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_19_860"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_19_860" result="effect2_dropShadow_19_860"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_19_860" result="shape"/>
</filter>
<filter id="filter11_d_19_860" x="418" y="376" width="44" height="44" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_19_860"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_19_860" result="shape"/>
</filter>
<filter id="filter12_dd_19_860" x="17" y="118" width="48" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="2" dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_19_860"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_19_860" result="effect2_dropShadow_19_860"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_19_860" result="shape"/>
</filter>
<filter id="filter13_dd_19_860" x="337" y="316" width="68" height="68" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="2" dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_19_860"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_19_860" result="effect2_dropShadow_19_860"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_19_860" result="shape"/>
</filter>
<filter id="filter14_dd_19_860" x="278" y="340" width="48" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="2" dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_19_860"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_19_860" result="effect2_dropShadow_19_860"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_19_860" result="shape"/>
</filter>
<clipPath id="clip0_19_860">
<rect width="420" height="500" fill="white"/>
</clipPath>
</defs>
</svg>`,

Blob : (accent, primary, secondary) => `
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="500" viewBox="0 0 420 500" fill="none">
<g clip-path="url(#clip0_29_2212)">
<rect class="Accent" width="420" height="500" fill="${accent}"/>
<g filter="url(#filter0_d_29_2212)">
<rect class="Primary" x="422" y="380" width="40" height="40" fill="${primary}"/>
</g>
<path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M161 84.6218L213.5 54.3109L161 24V84.6218ZM162 82.8897L211.5 54.3109L162 25.732V82.8897Z" fill="${primary}"/>
<path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M349.599 434.456L378.52 487.735L410.2 436.05L349.599 434.456ZM351.305 435.501L378.572 485.735L408.443 437.004L351.305 435.501Z" fill="${primary}"/>
<path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M161 143.622L213.5 113.311L161 83V143.622ZM162 141.89L211.5 113.311L162 84.732V141.89Z" fill="${primary}"/>
<path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M290.62 432.905L319.54 486.183L351.221 434.498L290.62 432.905ZM292.325 433.95L319.593 484.184L349.463 435.453L292.325 433.95Z" fill="${primary}"/>
<path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M110 114.622L162.5 84.3109L110 54V114.622ZM111 112.89L160.5 84.3109L111 55.732V112.89Z" fill="${primary}"/>
<path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M320.951 382.685L349.871 435.964L381.551 384.279L320.951 382.685ZM322.656 383.73L349.923 433.964L379.794 385.233L322.656 383.73Z" fill="${primary}"/>
<path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M59 85.6218L111.5 55.3109L59 25L59 85.6218ZM60 83.8897L109.5 55.3109L60 26.732L60 83.8897Z" fill="${primary}"/>
<path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M351.281 332.465L380.202 385.744L411.882 334.059L351.281 332.465ZM352.987 333.51L380.254 383.744L410.125 335.013L352.987 333.51Z" fill="${primary}"/>
<path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M110 173.622L162.5 143.311L110 113V173.622ZM111 171.89L160.5 143.311L111 114.732V171.89Z" fill="${primary}"/>
<path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M261.971 381.134L290.891 434.412L322.572 382.727L261.971 381.134ZM263.676 382.179L290.944 432.413L320.814 383.681L263.676 382.179Z" fill="${primary}"/>
<path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M162.5 142L110 172.311L162.5 202.622V142ZM161.5 143.732L112 172.311L161.5 200.89V143.732Z" fill="${primary}"/>
<path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M292.201 434.447L263.281 381.168L231.601 432.853L292.201 434.447ZM290.496 433.402L263.229 383.167L233.358 431.899L290.496 433.402Z" fill="${primary}"/>
<path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M59 143.622L111.5 113.311L59 83L59 143.622ZM60 141.89L109.5 113.311L60 84.732L60 141.89Z" fill="${primary}"/>
<path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M293.302 330.94L322.222 384.219L353.902 332.534L293.302 330.94ZM295.007 331.985L322.274 382.219L352.145 333.488L295.007 331.985Z" fill="${primary}"/>
<path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M7 114.622L59.5 84.3109L7 54L7 114.622ZM8 112.89L57.5 84.3109L8 55.732L8 112.89Z" fill="${primary}"/>
<path class="Primary" fill-rule="evenodd" clip-rule="evenodd" d="M323.659 279.72L352.579 332.999L384.259 281.314L323.659 279.72ZM325.364 280.766L352.631 331L382.502 282.268L325.364 280.766Z" fill="${primary}"/>
<path class="Secondary" d="M110 113.5L59.75 142.512L59.75 84.4881L110 113.5Z" fill="${secondary}"/>
<path class="Secondary" d="M350.072 434.714L322.391 383.719L380.395 385.244L350.072 434.714Z" fill="${secondary}"/>
<path class="Primary" d="M117 9.21539L153 30L117 50.7846V9.21539Z" fill="${primary}" stroke="${primary}"/>
<path class="Primary" d="M376.742 244.199L355.018 279.64L335.187 243.106L376.742 244.199Z" fill="${primary}" stroke="${primary}"/>
</g>
<defs>
<filter id="filter0_d_29_2212" x="418" y="376" width="44" height="44" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_29_2212"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_29_2212" result="shape"/>
</filter>
<clipPath id="clip0_29_2212">
<rect width="420" height="500" fill="white"/>
</clipPath>
</defs>
</svg>`
};

export default svgTemplates;
