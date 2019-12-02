<template>
    <div class="card border-primary mb-3" style="max-width: 30rem;">
        <div class="card-header">Download Stats</div>
        <div class="card-body text-primary">
            <div class="card-text">
                <div class="alert alert-success" role="alert" v-if="!doZip">
                    Download Complete.. Please check your GDrive.
                </div>
                <div class="alert alert-success" role="alert" v-else>
                    Download Complete.. Please check your GDrive after few minutes as its zipping and uploading to GDrive.
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['doZip']
}
</script>
