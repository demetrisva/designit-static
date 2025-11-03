<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          '1tuoQwXp4zKY2fsC}Qwim~,/#_T9;I Ap7I;DDQK|,~%ur[24j.gKPZ@Lz]8hek6' );
define( 'SECURE_AUTH_KEY',   '<6&7f4L1(&`|#HsD:giiEC U#c0l|=JdJsP6Y!RXb&_,sDI^pPLM]+EH=_{7Xegl' );
define( 'LOGGED_IN_KEY',     'F=Z$zhNC]ZuvNQ@FIQ~~[8#J)Y6EX{MQ$Mc1fi?;Aa<qY;}8Qcr7n5p Tt`gHUhB' );
define( 'NONCE_KEY',         '34/_*[d6hfMV!5^tmppYtOugV,nNa8;D<q&k49#$qF<-$-J.R6LOOER(F[sQqrN@' );
define( 'AUTH_SALT',         '?8Z~dPNt_2@mk^Gr4t9y8OBz-dq`Ci8R.0enX2j38N l!zQIsim7gij)uZ5ibf[p' );
define( 'SECURE_AUTH_SALT',  ',/+E%,2)f8-uVXpj%3VoMP[{i.<vd p$Vn[qQ6Yg;WP+|~da2zX8wCBa=KWu$EFl' );
define( 'LOGGED_IN_SALT',    'em^hUs^7[<D$efrp:m/I[T{qa[LZ {vF(f{[+0},3dC[ne9Sd2d]R..x0B$R5}YE' );
define( 'NONCE_SALT',        '[S:uC1h}YF[kzs[`+U%!.wpE_G(89rV|Z(w$Lr>y j!=VlV);g}5WH-1qR4ncK-9' );
define( 'WP_CACHE_KEY_SALT', 'Muk:vB|?%<mk-~5+F+IT<3&9pN@-/.CJwkDhJuX])Wls^Hrk >|AZ6hn4{QTu,(%' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'WP_ENVIRONMENT_TYPE', 'local' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
