<script lang="ts">
	import padNum from "$lib/util/padNum";

	export let songAlbum: string;
	export let songTitle: string;
	export let songArtist: string;
    export let totalSongs: number;
    export let duration: number;

    let seconds = duration / 1000;
    let minutesSeconds = Math.trunc(seconds % 60);
    let minutesMinutes = Math.trunc(seconds / 60);

    let imageSource = new URL(globalThis.location.origin + '/api/albumArt');
	imageSource.searchParams.set('album', songAlbum);
	imageSource.searchParams.set('artist', songArtist);
</script>

<div class="mx-auto aspect-ipod font-ipod grid p-4 bg-gradient-to-tr from-[#eceef0] to-[#fbfdfd] from-[47%] to-[53%] w-72 rounded-xl border-solid border-stone-300 border-2 shadow-lg">
    <div class="rounded text-xs w-full h-48 bg-[#f0f6fb] border-[3px] border-black border-solid">
        <div class="relative w-full px-1 h-5 text-sm text-center flex justify-between items-center border-b border-solid border-gray-400 bg-gradient-to-b from-[#f0f0f0] to-[#bfccd6]">
            <div>
                <svg width=15 viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M27.5 14.634a1 1 0 0 1 0 1.732L7.25 28.057a1 1 0 0 1-1.5-.866V3.81a1 1 0 0 1 1.5-.866L27.5 14.634Z" fill="url(#a)"/>
                    <path d="M27 15.5L6.75 27.1913L6.75 3.80866L27 15.5Z" stroke="black" stroke-opacity="0.2" stroke-width="3"/>
                    <defs>
                      <radialGradient id="a" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(180 6.75 7.75) scale(15.5)">
                        <stop stop-color="#80BDE2"/>
                        <stop offset="1" stop-color="#5D93BC"/>
                      </radialGradient>
                    </defs>
                  </svg>                  
            </div>
            <div class="absolute left-1/2 -translate-x-1/2">Top song</div> 
            <div>
                <svg width=25 viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26 10H3v11h23v-3h2v-5h-2v-3Z" fill="url(#b)" stroke="black" stroke-opacity=".53" stroke-width="2"/>
                    <defs>
                      <linearGradient id="b" x1="15.5" y1="10" x2="15.5" y2="21" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#BDEBB7"/>
                        <stop offset="1" stop-color="#0B6C3D"/>
                      </linearGradient>
                    </defs>
                </svg>                  
            </div>
        </div>
        <div class="grid grid-rows-6 gap-1 m-2">
            <div class="w-full h-full">1 of {totalSongs}</div>
            <div class="row-span-3 flex items-center overflow-scroll">
                <img loading="eager" class="w-18 mr-2" src={imageSource.href} alt={`Album cover for ${songAlbum}`}>
                <div class="flex flex-col gap-1 flex-grow whitespace-nowrap">
                    <div >
                        {songTitle}
                    </div>
                    <div>
                        {songArtist}
                    </div>
                    <div>
                         {songAlbum}
                    </div>    
                </div>
            </div>
            
            <div class="h-full flex items-end">
                <div class="h-4 w-full bg-progress-empty shadow">
                    <div class="h-full bg-progress shadow w-2/3"></div>        
                </div>
            </div>
            <div class="w-full h-full flex content-between items-center justify-between">
                <div>{Math.trunc(minutesMinutes * 2/3)}:{padNum(Math.trunc(minutesSeconds * 2/3), 2)}</div>
                <div>-{Math.trunc(minutesMinutes * 1/3)}:{padNum(Math.trunc(minutesSeconds * 1/3), 2)}</div>
            </div>
        </div>
    </div>
    <div class="w-full">
        <div class="bg-[#e3e8e9] aspect-square relative mx-auto w-44 rounded-full border border-solid border-stone-300">
            <span class="absolute top-2 left-1/2 -translate-x-1/2">
                <svg class="drop-shadow" height=12 viewBox="0 0 83 26" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.5037 13.2373C18.4473 11.9979 18.3909 10.6836 18.3344 9.29441C18.2783 7.90492 18.2597 6.56241 18.2786 5.26689H18.1939C17.8747 6.43091 17.5274 7.63261 17.1518 8.87198C16.7765 10.1111 16.3728 11.3314 15.9408 12.5329L13.181 20.7569H10.5054L7.97081 12.6455C7.59522 11.4253 7.24785 10.1863 6.92869 8.92827C6.60954 7.67028 6.31846 6.44982 6.05546 5.26689H5.99916C5.96163 6.50597 5.91465 7.83902 5.85821 9.26605C5.80206 10.6931 5.73645 12.0543 5.66139 13.3499L5.23895 20.9821H2L3.2673 2H7.82986L10.3082 9.63219C10.6462 10.7587 10.9607 11.8711 11.2514 12.9695C11.5425 14.068 11.8101 15.1522 12.0542 16.2223H12.1389C12.4016 15.1897 12.6878 14.1102 12.9975 12.9837C13.3075 11.8572 13.6503 10.7306 14.0259 9.60382L16.6451 2H21.1509L22.2494 20.9821H18.8699L18.5037 13.2373Z"/>
                    <path d="M36.3847 12.5613H29.2312V18.1376H37.2296V20.9821H25.7671V2H36.8071V4.84445H29.2312V9.74478H36.3847V12.5613Z"/>
                    <path d="M40.2685 20.9821V2H44.2113L49.1117 10.1393C49.7503 11.2093 50.3417 12.2795 50.8861 13.3499C51.4307 14.4199 51.9189 15.4714 52.3506 16.5042H52.4069C52.2943 15.2273 52.2145 13.96 52.1675 12.7023C52.1206 11.4443 52.0971 10.083 52.0971 8.61843V2H55.3077V20.9821H51.7309L46.7743 12.6455C46.1735 11.5941 45.5726 10.5051 44.9715 9.37864C44.3708 8.25215 43.8357 7.15373 43.3665 6.08339L43.2818 6.11175C43.3571 7.35084 43.4041 8.61356 43.4228 9.89991C43.4417 11.186 43.4511 12.6176 43.4511 14.1947V20.9821H40.2685Z"/>
                    <path d="M62.7399 1.99997V13.0679C62.7399 14.9267 63.0966 16.2974 63.81 17.1801C64.5236 18.0625 65.4625 18.5037 66.6265 18.5037C67.8845 18.5037 68.8656 18.0672 69.5698 17.1943C70.274 16.3211 70.6261 14.9456 70.6261 13.0679V1.99997H74.0898V12.8427C74.0898 14.3073 73.9067 15.57 73.5406 16.6309C73.1747 17.6915 72.6632 18.5692 72.006 19.2639C71.3488 19.9587 70.5555 20.4704 69.6261 20.799C68.6967 21.1276 67.6593 21.2919 66.5139 21.2919C65.4063 21.2919 64.4112 21.1323 63.5285 20.8131C62.6461 20.494 61.8857 19.9965 61.2474 19.3207C60.6091 18.6445 60.1209 17.7762 59.7829 16.7156C59.4451 15.6547 59.2762 14.3732 59.2762 12.8711V1.99997H62.7399Z"/>
                </svg>
            </span>
            <span class="absolute left-2 top-1/2 -translate-y-1/2">
                <svg class="drop-shadow" height=20 viewBox="0 0 32 32" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                    <path d="m6 15.5 11.25-6.495v12.99L6 15.5Z"/>
                    <path d="m17 15.5 11.25-6.495v12.99L17 15.5Z"/>
                    <rect x="4" y="9" width="2" height="13"/>
                </svg>
            </span>
            <span class="absolute right-2 top-1/2 -translate-y-1/2">
                <svg class="drop-shadow" height=20 viewBox="0 0 32 32" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                    <path d="m26 15.5-11.25 6.495V9.005L26 15.5Z"/>
                    <path d="M15 15.5 3.75 21.995V9.005L15 15.5Z"/>
                    <rect x="28" y="22" width="2" height="13" transform="rotate(-180 28 22)"/>
                </svg>                  
            </span>
            <span class="absolute bottom-2 left-1/2 -translate-x-1/2 justify-self-end">
                <svg class="drop-shadow" height="20" viewBox="0 0 32 32" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 15.5 5.75 21.995V9.005L17 15.5Z"/>
                    <rect x="20" y="9" width="2" height="13"/>
                    <rect x="25" y="9" width="2" height="13"/>
                </svg>                  
            </span>
            <div class="w-16 border border-solid border-gray-300 rounded-full aspect-square bg-[#f8fafb] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"></div>
        </div>
    </div>
</div>