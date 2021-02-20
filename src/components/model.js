export default {
    name: 'model',
    functional: true,
    props: {
        render: Function,
        params: {
            type: Object, default() {
                return {}
            }
        },
    },
    render: (h, ctx) => {
        const params = ctx.props.params;
        return ctx.props.render(h, params);
    }
};