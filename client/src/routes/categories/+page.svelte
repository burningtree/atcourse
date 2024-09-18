<script>
    import CategoryTable from "$lib/components/CategoryTable.svelte";
    import Menu from "$lib/components/Menu.svelte";
    import { categories } from "$lib/config.json";
</script>

<Menu pageId="categories" />

<CategoryTable {categories} />
