<script>
    import CategoryTable from "$lib/components/CategoryTable.svelte";
    import Menu from "$lib/components/Menu.svelte";
    import { getContext } from "svelte";

    const { categories } = getContext("instance");
</script>

<Menu pageId="categories" />

<CategoryTable {categories} />
