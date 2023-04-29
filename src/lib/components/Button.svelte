<script lang="ts">
    export let fullWidth: boolean = false;
    export let absoluteBottom: boolean = false;
    export let primary: boolean = false;
    let additionalClasses: string[] = [];
    if (fullWidth) {
        additionalClasses.push("w-full");
    }
    if (absoluteBottom) {
        additionalClasses.push("absolute bottom-0")
    }
    if (primary) {
        additionalClasses.push("bg-blue-500 hover:bg-blue-600 text-white")
    } else {
        additionalClasses.push("bg-white hover:bg-gray-100")
    }
</script>

<button class={"h-10 py-2 px-4 shadow inline-flex items-center justify-center rounded text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background " + additionalClasses.join(" ")}><slot /></button>
